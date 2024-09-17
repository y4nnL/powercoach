import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useRefStore = defineStore('ref', () => {
  const map: Record<'main', Ref<HTMLElement | null>> = {
    main: ref(null)
  }

  function get<T extends keyof typeof map>(id: T): (typeof map)[T] {
    return map[id]
  }

  function set<T extends keyof typeof map>(id: T, ref: Ref<HTMLElement | null>) {
    map[id] = ref
  }

  return { get, set }
})
