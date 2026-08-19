import { defineComponent, type PropType } from 'vue'
import { renderWdContent, type WdRenderable } from './content'

/** Renders string / VNode / component / `() => VNode` content. */
export const WdRenderableView = defineComponent({
  name: 'WdRenderable',
  props: {
    value: {
      type: [String, Number, Object, Function] as PropType<WdRenderable>,
      required: true,
    },
  },
  setup(props) {
    return () => renderWdContent(props.value)
  },
})
