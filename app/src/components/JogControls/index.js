// @flow
// jog controls component
import * as React from 'react'

import { Flex, JUSTIFY_CENTER } from '@opentrons/components'

import { DirectionControl } from './DirectionControl'
import { StepSizeControl } from './StepSizeControl'
import {
  HORIZONTAL_PLANE,
  VERTICAL_PLANE,
  DEFAULT_STEP_SIZES,
} from './constants'

import type { Jog, Plane, StepSize } from './types'

export type { Jog }
export type JogControlsProps = {|
  jog: Jog,
  planes?: Array<Plane>,
  stepSizes?: Array<StepSize>,
  auxiliaryControl?: React.Node | null,
|}

export { HORIZONTAL_PLANE, VERTICAL_PLANE }

export function JogControls(props: JogControlsProps): React.Node {
  const {
    stepSizes = DEFAULT_STEP_SIZES,
    planes = [HORIZONTAL_PLANE, VERTICAL_PLANE],
    jog,
    auxiliaryControl = null,
  } = props
  const [currentStepSize, setCurrentStepSize] = React.useState<number>(
    stepSizes[0]
  )
  return (
    <Flex justifyContent={JUSTIFY_CENTER}>
      <StepSizeControl
        {...{ currentStepSize, setCurrentStepSize, stepSizes }}
      />
      {planes.map(plane => (
        <DirectionControl
          key={plane}
          plane={plane}
          jog={jog}
          stepSize={currentStepSize}
        />
      ))}
      {auxiliaryControl}
    </Flex>
  )
}
