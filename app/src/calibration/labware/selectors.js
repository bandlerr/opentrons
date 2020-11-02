// @flow
import { createSelector } from 'reselect'
import head from 'lodash/head'
import uniqWith from 'lodash/uniqWith'

import {
  getLabwareDisplayName,
  getModuleDisplayName,
} from '@opentrons/shared-data'

import { selectors as robotSelectors } from '../../robot'
import {
  matchesLabwareIdentityForQuantity,
  matchesLabwareIdentityForCalibration,
  formatCalibrationData,
} from './utils'

import type { State } from '../../types'
import type { LabwareCalibration } from '../types'
import type { LabwareSummary, BaseProtocolLabware } from './types'

export const getLabwareCalibrations = (
  state: State,
  robotName: string
): Array<LabwareCalibration> => {
  return state.calibration[robotName]?.labwareCalibrations?.data ?? []
}

// TODO(bc, 2020-08-05): this selector should move to a protocol-focused module
// when we don't have to rely on RPC-state selectors for protocol equipment info
export const getProtocolLabwareList: (
  state: State,
  robotName: string
) => Array<BaseProtocolLabware> = createSelector(
  (state, robotName) => robotSelectors.getLabware(state),
  getLabwareCalibrations,
  (state, robotName) => robotSelectors.getModulesBySlot(state),
  (protocolLabware, calibrations, modulesBySlot) => {
    return protocolLabware.map(lw => {
      const baseLabware = {
        ...lw,
        loadName: lw.definition?.parameters.loadName ?? lw.type,
        namespace: lw.definition?.namespace ?? null,
        version: lw.definition?.version ?? null,
        parent: modulesBySlot[lw.slot]?.model ?? null,
        calibrationData: null,
      }
      const calData = calibrations
        .filter(calibration =>
          matchesLabwareIdentityForCalibration(calibration, baseLabware)
        )
        .map(formatCalibrationData)

      return {
        ...baseLabware,
        calibrationData: head(calData) ?? null,
      }
    })
  }
)

// TODO(mc, 2020-07-27): this selector should move to a protocol-focused module
// when we don't have to rely on RPC-state selectors for protocol equipment info
// NOTE(mc, 2020-07-27): due to how these endpoints work, v1 labware will always
// come back as having "no calibration data". The `legacy` field is here so the
// UI can adjust its messaging accordingly
export const getUniqueProtocolLabwareSummaries: (
  state: State,
  robotName: string
) => Array<LabwareSummary> = createSelector(
  getProtocolLabwareList,
  getLabwareCalibrations,
  (
    baseLabwareList: Array<BaseProtocolLabware>,
    calibrations: Array<LabwareCalibration>
  ) => {
    const uniqueLabware = uniqWith<BaseProtocolLabware>(
      baseLabwareList,
      matchesLabwareIdentityForQuantity
    )

    return uniqueLabware.map(lw => {
      const {
        definition: def,
        loadName,
        parent,
        calibrationData,
        definitionHash,
      } = lw
      const displayName = def ? getLabwareDisplayName(def) : loadName
      const parentDisplayName = parent ? getModuleDisplayName(parent) : null

      const quantity = baseLabwareList.filter(t =>
        matchesLabwareIdentityForQuantity(t, lw)
      ).length
      const summary: LabwareSummary = {
        displayName,
        parentDisplayName,
        quantity,
        calibration: calibrationData,
        calDataAvailable: definitionHash !== null,
      }

      return summary
    })
  }
)
