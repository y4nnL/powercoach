import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export type DebugStore = {
  reticule: Ref<boolean>
}

export const useDebugStore = defineStore<'debug', DebugStore>('debug', () => {
  const debugStore: DebugStore = {
    reticule: ref<boolean>(false)
  }

  return { ...debugStore }
})
