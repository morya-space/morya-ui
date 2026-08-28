// eslint-disable-next-line antfu/no-import-dist
import { createToolHandlers } from '../dist/tools.js'

const h = createToolHandlers()
const component = JSON.parse((await h.getComponent({ component: 'Button', includeApi: true })).content[0].text)
console.log('props sample:', JSON.stringify(component.props.slice(0, 4), null, 2))

const validation = JSON.parse(
  (
    await h.validateUsage({
      component: 'Button',
      code: '<WiButton label="Hi" foo="1" />',
    })
  ).content[0].text,
)
console.log('validation:', JSON.stringify(validation, null, 2))
