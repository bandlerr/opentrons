// @flow
import { GET } from '../../../robot-api'
import {
  makeResponseFixtures,
  mockFailureBody,
} from '../../../robot-api/__fixtures__'
import { LABWARE_CALIBRATION_PATH } from '../constants'

import type { ResponseFixtures } from '../../../robot-api/__fixtures__'
import type {
  LabwareCalibration,
  AllLabwareCalibrations,
} from '../../api-types'

export const mockLabwareCalibration1: LabwareCalibration = {
  calibrationData: {
    offset: {
      value: [0.0, 0.0, 0.0],
      lastModified: '2020-04-05T14:30',
    },
    tipLength: {
      value: 30,
      lastModified: '2007-05-05T0:30',
    },
  },
  loadName: 'opentrons_96_tiprack_10ul',
  namespace: 'opentrons',
  version: 1,
  parent: 'fake_id',
  definitionHash: '123FakeDefinitionHash',
  id: 'some id',
}

export const mockLabwareCalibration2: LabwareCalibration = {
  calibrationData: {
    offset: {
      value: [1.0, 1.0, 1.0],
      lastModified: '2020-04-05T14:30',
    },
    tipLength: {
      value: 30,
      lastModified: '2007-05-05T0:30',
    },
  },
  loadName: 'opentrons_96_tiprack_1000ul',
  namespace: 'opentrons',
  version: 1,
  parent: '',
  definitionHash: '456FakeDefinitionHash',
  id: 'some id',
}

export const mockAllLabwareCalibration: AllLabwareCalibrations = {
  data: [mockLabwareCalibration1, mockLabwareCalibration2],
}

export const {
  successMeta: mockFetchLabwareCalibrationSuccessMeta,
  failureMeta: mockFetchLabwareCalibrationFailureMeta,
  success: mockFetchLabwareCalibrationSuccess,
  failure: mockFetchLabwareCalibrationFailure,
}: ResponseFixtures<
  AllLabwareCalibrations,
  {| message: string |}
> = makeResponseFixtures({
  method: GET,
  path: LABWARE_CALIBRATION_PATH,
  successStatus: 200,
  successBody: mockAllLabwareCalibration,
  failureStatus: 500,
  failureBody: mockFailureBody,
})
