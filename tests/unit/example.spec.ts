import { mount } from '@vue/test-utils'
import WorkoutsView from '@/views/WorkoutsView.vue'

describe('Workouts Tab', () => {
  it('renders workouts tab', () => {
    const wrapper = mount(WorkoutsView)
    expect(wrapper.text()).toMatch('Workouts')
  })
})
