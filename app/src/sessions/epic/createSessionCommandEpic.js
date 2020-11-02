// @flow
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { POST, fetchRobotApi } from '../../robot-api'
import { withRobotHost } from '../../robot-api/operators'

import * as Actions from '../actions'
import * as Constants from '../constants'
import { mapActionToRequest as mapActionToFetchSessionRequest } from './fetchSessionEpic'

import type { State, Epic } from '../../types'
import type {
  RobotApiRequestOptions,
  RobotHost,
  RobotApiResponse,
} from '../../robot-api/types'
import type { CreateSessionCommandAction } from '../types'

const mapActionToRequest = (
  action: CreateSessionCommandAction
): RobotApiRequestOptions => ({
  method: POST,
  path: `${Constants.SESSIONS_PATH}/${action.payload.sessionId}${Constants.SESSIONS_COMMANDS_EXECUTE_PATH_EXTENSION}`,
  body: {
    data: {
      command: action.payload.command.command,
      data: action.payload.command.data,
    },
  },
})

// NOTE(mc, 2020-06-15): successful response is a successful GET /sessions/:id
// failure response may be failed POST .../commands/execute or failed GET
const mapResponseToAction = (
  response: RobotApiResponse,
  originalAction: CreateSessionCommandAction
) => {
  const { host, body, ...responseMeta } = response
  const meta = { ...originalAction.meta, response: responseMeta }

  return response.ok
    ? Actions.createSessionCommandSuccess(
        host.name,
        originalAction.payload.sessionId,
        body,
        meta
      )
    : Actions.createSessionCommandFailure(
        host.name,
        originalAction.payload.sessionId,
        body,
        meta
      )
}

export const createSessionCommandEpic: Epic = (action$, state$) => {
  return action$.pipe(
    ofType(Constants.CREATE_SESSION_COMMAND),
    withRobotHost(state$, a => a.payload.robotName),
    switchMap<[CreateSessionCommandAction, State, RobotHost], _, _>(
      ([originalAction, state, host]) => {
        const commandRequest = mapActionToRequest(originalAction)
        const fetchRequest = mapActionToFetchSessionRequest(originalAction)

        return fetchRobotApi(host, commandRequest).pipe(
          switchMap(response =>
            response.ok ? fetchRobotApi(host, fetchRequest) : of(response)
          ),
          // NOTE(mc, 2020-06-15): both command execution and session fetch
          // failure will trigger a failure action
          map(response => mapResponseToAction(response, originalAction))
        )
      }
    )
  )
}
