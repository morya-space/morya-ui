import type {PropType} from 'vue';
import type {MRenderable} from './content';
import { defineComponent  } from 'vue'
import { renderMContent  } from './content'

/** Renders string / VNode / component / `() => VNode` content. */
export const MRenderableView = defineComponent({
  name: 'MRenderable',
  props: {
    value: {
      type: [String, Number, Object, Function] as PropType<MRenderable>,
      required: true,
    },
  },
  setup(props) {
    return () => renderMContent(props.value)
  },
})
