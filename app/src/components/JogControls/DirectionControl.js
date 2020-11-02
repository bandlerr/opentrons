// @flow
// jog controls component
import * as React from 'react'

import {
  Box,
  PrimaryBtn,
  Icon,
  HandleKeypress,
  type IconName,
  ALIGN_CENTER,
} from '@opentrons/components'
import { ControlContainer } from './ControlContainer'

import type { Jog, Plane, Sign, Bearing } from './types'
import { HORIZONTAL_PLANE, VERTICAL_PLANE } from './constants'

type Control = {|
  bearing: Bearing,
  keyName: string,
  shiftKey: boolean,
  gridRow: number,
  gridColumn: number,
  iconName: IconName,
  axis: 'x' | 'y' | 'z',
  sign: Sign,
|}
type ControlsContents = {|
  controls: Array<Control>,
  title: string,
  subtitle: string,
|}

const CONTROLS_CONTENTS_BY_PLANE: { [Plane]: ControlsContents } = {
  [VERTICAL_PLANE]: {
    controls: [
      {
        keyName: 'ArrowUp',
        shiftKey: true,
        bearing: 'up',
        gridRow: 1,
        gridColumn: 2,
        iconName: 'ot-arrow-up',
        axis: 'z',
        sign: 1,
      },
      {
        keyName: 'ArrowDown',
        shiftKey: true,
        bearing: 'down',
        gridRow: 2,
        gridColumn: 2,
        iconName: 'ot-arrow-down',
        axis: 'z',
        sign: -1,
      },
    ],
    title: 'Up & Down',
    subtitle: 'Arrow keys + SHIFT',
  },
  [HORIZONTAL_PLANE]: {
    controls: [
      {
        keyName: 'ArrowLeft',
        shiftKey: false,
        bearing: 'left',
        gridRow: 2,
        gridColumn: 1,
        iconName: 'ot-arrow-left',
        axis: 'x',
        sign: -1,
      },
      {
        keyName: 'ArrowRight',
        shiftKey: false,
        bearing: 'right',
        gridRow: 2,
        gridColumn: 3,
        iconName: 'ot-arrow-right',
        axis: 'x',
        sign: 1,
      },
      {
        keyName: 'ArrowUp',
        shiftKey: false,
        bearing: 'back',
        gridRow: 1,
        gridColumn: 2,
        iconName: 'ot-arrow-up',
        axis: 'y',
        sign: 1,
      },
      {
        keyName: 'ArrowDown',
        shiftKey: false,
        bearing: 'forward',
        gridRow: 2,
        gridColumn: 2,
        iconName: 'ot-arrow-down',
        axis: 'y',
        sign: -1,
      },
    ],
    title: 'Across Deck',
    subtitle: 'Arrow keys',
  },
}

type DirectionControlProps = {|
  plane: Plane,
  jog: Jog,
  stepSize: number,
|}

export function DirectionControl(props: DirectionControlProps): React.Node {
  const { title, subtitle, controls } = CONTROLS_CONTENTS_BY_PLANE[props.plane]

  return (
    <ControlContainer {...{ title, subtitle }}>
      <HandleKeypress
        preventDefault
        handlers={controls.map(({ keyName, shiftKey, axis, sign }) => ({
          key: keyName,
          shiftKey,
          onPress: () => props.jog(axis, sign, props.stepSize),
        }))}
      >
        <Box display="grid" gridTemplateColumns="repeat(3, [col] 3rem)">
          {controls.map(
            ({ bearing, gridRow, gridColumn, iconName, axis, sign }) => (
              <PrimaryBtn
                key={bearing}
                title={bearing}
                width="2.5rem"
                height="2.5rem"
                alignSelf={ALIGN_CENTER}
                onClick={() => props.jog(axis, sign, props.stepSize)}
              >
                <Icon name={iconName} />
              </PrimaryBtn>
            )
          )}
        </Box>
      </HandleKeypress>
    </ControlContainer>
  )
}
