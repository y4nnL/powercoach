/// <reference types="vite/client" />

declare module '@jamescoyle/vue-icon' {
  import * as Vue from 'vue'
  import * as mdijs from '@mdi/js'
  export type MDI = { [x in keyof typeof mdijs]: mdijs }
  export default Vue.defineComponent<{ path: mdijs; type: 'mdi'; size: number }>()
}
