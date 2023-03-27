import type { Meta, Story } from '@storybook/vue3'

import { Watermark } from './index'

export default {
  title: '扩展组件/水印 Watermark',
  component: Watermark,
} as Meta

export const Content: Story = (args) => ({
  components: { Watermark },
  setup: () => ({ args }),
  template: `
    <watermark v-bind="args">
      <div style="height: 300px"></div>
    </watermark>
  `,
})
Content.args = {
  content: '我是水印',
}
Content.storyName = '文字水印'