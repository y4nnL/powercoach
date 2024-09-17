import { useScroll } from '@vueuse/core'
import { useRefStore } from '@/stores/ref'

export function useMainScroll(throttle: number = 100) {
  return useScroll(useRefStore().get('main'), {
    throttle
  })
}
