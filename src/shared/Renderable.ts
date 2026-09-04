import type {PropType} from 'vue';
import type {WdRenderable} from './content';
import { defineComponent  } from 'vue'
import { renderWdContent  } from './content'

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
