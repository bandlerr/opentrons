// @flow

import type { LabwareDefinition2 } from '@opentrons/shared-data'

import typeof {
  CREATE_SESSION,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  DELETE_SESSION,
  DELETE_SESSION_SUCCESS,
  DELETE_SESSION_FAILURE,
  FETCH_SESSION,
  FETCH_SESSION_SUCCESS,
  FETCH_SESSION_FAILURE,
  FETCH_ALL_SESSIONS,
  FETCH_ALL_SESSIONS_SUCCESS,
  FETCH_ALL_SESSIONS_FAILURE,
  ENSURE_SESSION,
  CREATE_SESSION_COMMAND,
  CREATE_SESSION_COMMAND_SUCCESS,
  CREATE_SESSION_COMMAND_FAILURE,
  SESSION_TYPE_CALIBRATION_HEALTH_CHECK,
  SESSION_TYPE_TIP_LENGTH_CALIBRATION,
  SESSION_TYPE_DECK_CALIBRATION,
  SESSION_TYPE_PIPETTE_OFFSET_CALIBRATION,
} from './constants'

import type {
  RobotApiRequestMeta,
  RobotApiV2ResponseBody,
  RobotApiV2ErrorResponseBody,
} from '../robot-api/types'

import * as CalCheckTypes from './calibration-check/types'
import * as TipLengthCalTypes from './tip-length-calibration/types'
import * as DeckCalTypes from './deck-calibration/types'
import * as PipOffsetCalTypes from './pipette-offset-calibration/types'
import * as CalCheckConstants from './calibration-check/constants'
import * as TipCalConstants from './tip-length-calibration/constants'
import * as DeckCalConstants from './deck-calibration/constants'
import * as PipOffsetCalConstants from './pipette-offset-calibration/constants'
import * as CommonCalConstants from './common-calibration/constants'

export type * from './calibration-check/types'
export type * from './tip-length-calibration/types'
export type * from './deck-calibration/types'
export type * from './pipette-offset-calibration/types'

// The available session types
export type SessionType =
  | SESSION_TYPE_CALIBRATION_HEALTH_CHECK
  | SESSION_TYPE_TIP_LENGTH_CALIBRATION
  | SESSION_TYPE_DECK_CALIBRATION
  | SESSION_TYPE_PIPETTE_OFFSET_CALIBRATION

export type SessionParams =
  | {||}
  | TipLengthCalTypes.TipLengthCalibrationSessionParams
  | PipOffsetCalTypes.PipetteOffsetCalibrationSessionParams

export type SessionCommandString =
  | $Values<typeof CalCheckConstants.checkCommands>
  | $Values<typeof TipCalConstants.tipCalCommands>
  | $Values<typeof DeckCalConstants.deckCalCommands>
  | $Values<typeof PipOffsetCalConstants.pipOffsetCalCommands>
  | $Values<typeof CommonCalConstants.sharedCalCommands>

export type CalibrationSessionStep =
  | CalCheckTypes.RobotCalibrationCheckStep
  | TipLengthCalTypes.TipLengthCalibrationStep
  | DeckCalTypes.DeckCalibrationStep
  | PipOffsetCalTypes.PipetteOffsetCalibrationStep

export type VectorTuple = [number, number, number]

export type SessionCommandData =
  | {| vector: VectorTuple |}
  | {| hasBlock: boolean |}
  | {||}
export type SessionCommandParams = {
  command: SessionCommandString,
  data?: SessionCommandData,
}

export type CalibrationCheckSessionResponseAttributes = {|
  sessionType: SESSION_TYPE_CALIBRATION_HEALTH_CHECK,
  details: CalCheckTypes.CheckCalibrationHealthSessionDetails,
  createParams: {},
|}

export type TipLengthCalibrationSessionResponseAttributes = {|
  sessionType: SESSION_TYPE_TIP_LENGTH_CALIBRATION,
  details: TipLengthCalTypes.TipLengthCalibrationSessionDetails,
  createParams: TipLengthCalTypes.TipLengthCalibrationSessionParams,
|}

export type DeckCalibrationSessionResponseAttributes = {|
  sessionType: SESSION_TYPE_DECK_CALIBRATION,
  details: DeckCalTypes.DeckCalibrationSessionDetails,
  createParams: {},
|}
export type PipetteOffsetCalibrationSessionResponseAttributes = {|
  sessionType: SESSION_TYPE_PIPETTE_OFFSET_CALIBRATION,
  details: PipOffsetCalTypes.PipetteOffsetCalibrationSessionDetails,
  createParams: PipOffsetCalTypes.PipetteOffsetCalibrationSessionParams,
|}

export type SessionResponseAttributes =
  | CalibrationCheckSessionResponseAttributes
  | TipLengthCalibrationSessionResponseAttributes
  | DeckCalibrationSessionResponseAttributes
  | PipetteOffsetCalibrationSessionResponseAttributes

export type CalibrationCheckSession = {|
  ...CalibrationCheckSessionResponseAttributes,
  id: string,
|}

export type TipLengthCalibrationSession = {|
  ...TipLengthCalibrationSessionResponseAttributes,
  id: string,
|}

export type DeckCalibrationSession = {|
  ...DeckCalibrationSessionResponseAttributes,
  id: string,
|}

export type PipetteOffsetCalibrationSession = {|
  ...PipetteOffsetCalibrationSessionResponseAttributes,
  id: string,
|}

export type Session =
  | CalibrationCheckSession
  | TipLengthCalibrationSession
  | DeckCalibrationSession
  | PipetteOffsetCalibrationSession

export type SessionCommandAttributes = {|
  command: SessionCommandString,
  data: SessionCommandData,
|}

export type SessionResponseModel = Session

export type SessionCommandResponseModel = {|
  ...SessionCommandAttributes,
  id: string,
  status?: string,
|}

export type SessionResponse = RobotApiV2ResponseBody<SessionResponseModel>
export type MultiSessionResponse = RobotApiV2ResponseBody<
  $ReadOnlyArray<SessionResponseModel>
>

export type SessionCommandResponse = RobotApiV2ResponseBody<SessionCommandResponseModel>

export type CreateSessionAction = {|
  type: CREATE_SESSION,
  payload: {|
    robotName: string,
    sessionType: SessionType,
    params: SessionParams,
  |},
  meta: RobotApiRequestMeta,
|}

export type CreateSessionSuccessAction = {|
  type: CREATE_SESSION_SUCCESS,
  payload: {| robotName: string, ...SessionResponse |},
  meta: RobotApiRequestMeta,
|}

export type CreateSessionFailureAction = {|
  type: CREATE_SESSION_FAILURE,
  payload: {| robotName: string, error: RobotApiV2ErrorResponseBody |},
  meta: RobotApiRequestMeta,
|}

export type DeleteSessionAction = {|
  type: DELETE_SESSION,
  payload: {| robotName: string, sessionId: string |},
  meta: RobotApiRequestMeta,
|}

export type DeleteSessionSuccessAction = {|
  type: DELETE_SESSION_SUCCESS,
  payload: {| robotName: string, ...SessionResponse |},
  meta: RobotApiRequestMeta,
|}

export type DeleteSessionFailureAction = {|
  type: DELETE_SESSION_FAILURE,
  payload: {|
    robotName: string,
    sessionId: string,
    error: RobotApiV2ErrorResponseBody,
  |},
  meta: RobotApiRequestMeta,
|}

export type FetchSessionAction = {|
  type: FETCH_SESSION,
  payload: {| robotName: string, sessionId: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchSessionSuccessAction = {|
  type: FETCH_SESSION_SUCCESS,
  payload: {| robotName: string, ...SessionResponse |},
  meta: RobotApiRequestMeta,
|}

export type FetchSessionFailureAction = {|
  type: FETCH_SESSION_FAILURE,
  payload: {|
    robotName: string,
    sessionId: string,
    error: RobotApiV2ErrorResponseBody,
  |},
  meta: RobotApiRequestMeta,
|}

export type FetchAllSessionsAction = {|
  type: FETCH_ALL_SESSIONS,
  payload: {| robotName: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchAllSessionsSuccessAction = {|
  type: FETCH_ALL_SESSIONS_SUCCESS,
  payload: {|
    robotName: string,
    sessions: $ReadOnlyArray<SessionResponseModel>,
  |},
  meta: RobotApiRequestMeta,
|}

export type FetchAllSessionsFailureAction = {|
  type: FETCH_ALL_SESSIONS_FAILURE,
  payload: {| robotName: string, error: RobotApiV2ErrorResponseBody |},
  meta: RobotApiRequestMeta,
|}

export type EnsureSessionAction = {|
  type: ENSURE_SESSION,
  payload: {|
    robotName: string,
    sessionType: SessionType,
    params: SessionParams,
  |},
  meta: RobotApiRequestMeta,
|}

export type CreateSessionCommandAction = {|
  type: CREATE_SESSION_COMMAND,
  payload: {|
    robotName: string,
    sessionId: string,
    command: SessionCommandAttributes,
  |},
  meta: RobotApiRequestMeta,
|}

export type CreateSessionCommandSuccessAction = {|
  type: CREATE_SESSION_COMMAND_SUCCESS,
  payload: {|
    robotName: string,
    sessionId: string,
    ...SessionResponse,
  |},
  meta: RobotApiRequestMeta,
|}

export type CreateSessionCommandFailureAction = {|
  type: CREATE_SESSION_COMMAND_FAILURE,
  payload: {|
    robotName: string,
    sessionId: string,
    error: RobotApiV2ErrorResponseBody,
  |},
  meta: RobotApiRequestMeta,
|}

export type SessionsAction =
  | CreateSessionAction
  | CreateSessionSuccessAction
  | CreateSessionFailureAction
  | DeleteSessionAction
  | DeleteSessionSuccessAction
  | DeleteSessionFailureAction
  | FetchSessionAction
  | FetchSessionSuccessAction
  | FetchSessionFailureAction
  | FetchAllSessionsAction
  | FetchAllSessionsSuccessAction
  | FetchAllSessionsFailureAction
  | CreateSessionCommandAction
  | CreateSessionCommandSuccessAction
  | CreateSessionCommandFailureAction
  | EnsureSessionAction

export type SessionsById = $Shape<{|
  [id: string]: Session,
|}>

export type PerRobotSessionState = $Shape<
  $ReadOnly<{|
    robotSessions: SessionsById | null,
  |}>
>

export type SessionState = $Shape<
  $ReadOnly<{|
    [robotName: string]: void | PerRobotSessionState,
  |}>
>

export type AnalyticsModelsByMount = {|
  leftPipetteModel?: string,
  rightPipetteModel?: string,
|}

export type CalibrationCheckCommonEventData = {|
  comparingHeightExceedsThreshold?: boolean,
  comparingHeightErrorSource?: string,
  comparingPointOneExceedsThreshold?: boolean,
  comparingPointOneErrorSource?: string,
  comparingPointTwoExceedsThreshold?: boolean,
  comparingPointTwoErrorSource?: string,
  comparingPointThreeExceedsThreshold?: boolean,
  comparingPointThreeErrorSource?: string,
|}

export type CalibrationCheckIntercomData = {|
  ...CalibrationCheckCommonEventData,
  succeeded: boolean,
|}

export type CalibrationCheckAnalyticsData = {|
  ...CalibrationCheckCommonEventData,
  comparingHeightDifferenceVector?: VectorTuple,
  comparingHeightThresholdVector?: VectorTuple,
  comparingPointOneDifferenceVector?: VectorTuple,
  comparingPointOneThresholdVector?: VectorTuple,
  comparingPointTwoDifferenceVector?: VectorTuple,
  comparingPointTwoThresholdVector?: VectorTuple,
  comparingPointThreeDifferenceVector?: VectorTuple,
  comparingPointThreeThresholdVector?: VectorTuple,
|}

export type SharedAnalyticsProps = {|
  sessionType: SessionType,
|}

export type CalibrationCheckSessionAnalyticsProps = {|
  ...SharedAnalyticsProps,
  ...AnalyticsModelsByMount,
  ...CalibrationCheckAnalyticsData,
|}

export type CalibrationCheckSessionIntercomProps = {|
  ...SharedAnalyticsProps,
  ...AnalyticsModelsByMount,
  ...CalibrationCheckIntercomData,
|}

export type SessionAnalyticsProps = CalibrationCheckSessionAnalyticsProps
export type SessionIntercomProps = CalibrationCheckSessionIntercomProps

export type CalibrationLabware = {|
  slot: string,
  loadName: string,
  namespace: string,
  version: number,
  isTiprack: boolean,
  definition: LabwareDefinition2,
|}
