import type {PropType} from 'vue';
import type {WkRenderable} from './content';
import { defineComponent  } from 'vue'
import { renderWkContent  } from './content'

/** Renders string / VNode / component / `() => VNode` content. */
export const WkRenderableView = defineComponent({
  name: 'WkRenderable',
  props: {
    value: {
      type: [String, Number, Object, Function] as PropType<WkRenderable>,
      required: true,
    },
  },
  setup(props) {
    return () => renderWkContent(props.value)
  },
})
