import type {PropType} from 'vue';
import type {RdRenderable} from './content';
import { defineComponent  } from 'vue'
import { renderRdContent  } from './content'

/** Renders string / VNode / component / `() => VNode` content. */
export const RdRenderableView = defineComponent({
  name: 'RdRenderable',
  props: {
    value: {
      type: [String, Number, Object, Function] as PropType<RdRenderable>,
      required: true,
    },
  },
  setup(props) {
    return () => renderRdContent(props.value)
  },
})
