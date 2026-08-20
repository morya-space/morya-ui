import { defineComponent, type PropType } from 'vue'
import { renderWiContent, type WiRenderable } from './content'

/** Renders string / VNode / component / `() => VNode` content. */
export const WiRenderableView = defineComponent({
  name: 'WiRenderable',
  props: {
    value: {
      type: [String, Number, Object, Function] as PropType<WiRenderable>,
      required: true,
    },
  },
  setup(props) {
    return () => renderWiContent(props.value)
  },
})
