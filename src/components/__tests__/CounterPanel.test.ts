import { describe, test, expect, it } from '@jest/globals'
import { fireEvent, render } from '@testing-library/vue'
import CounterPanel from '../CounterPanel.vue'

describe('Counter Panel test', () => {
  test('click 2 times test', async () => {
    const { getByText } = render(CounterPanel)
    getByText('Times clicked: 0')
    const button = getByText('increment')
    await fireEvent.click(button)
    await fireEvent.click(button)

    getByText('Times clicked: 2')
  })
})
