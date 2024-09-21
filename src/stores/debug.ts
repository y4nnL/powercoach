import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export type DebugStore = {
  reticle: Ref<boolean>
}

export const useDebugStore = defineStore<'debug', DebugStore>('debug', () => {
  const debugStore: DebugStore = {
    reticle: ref<boolean>(true)
  }

  return { ...debugStore }
})
