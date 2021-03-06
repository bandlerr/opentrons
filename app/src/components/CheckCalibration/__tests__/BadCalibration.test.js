// @flow
import * as React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import { BadCalibration } from '../BadCalibration'

describe('BadCalibration', () => {
  const mockDeleteSession = jest.fn()

  const getExitButton = wrapper =>
    wrapper
      .find('PrimaryButton[children="Drop tip in trash and exit"]')
      .find('button')

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('clicking button exits calibration check', () => {
    const wrapper = mount(<BadCalibration deleteSession={mockDeleteSession} />)
    act(() => getExitButton(wrapper).invoke('onClick')())
    wrapper.update()
    expect(mockDeleteSession).toHaveBeenCalled()
  })
})
