import { camelize } from 'vue'
import type { ObjectDirective, DirectiveBinding } from 'vue'

declare module 'vue' {
  interface HTMLAttributes {
    vIntersect?: PIntersectProps
  }
}

export type PIntersectProps = { on: (visible: boolean) => any; options?: IntersectionObserverInit }

const IMMEDIATELY_VISIBLE_TIME = 200
const TIME_IN_VIEWPORT = 500

const timeouts: Record<string, number> = {}
const observers: Record<string, IntersectionObserver> = {}

let uid: number = 1

function key(binding: DirectiveBinding): string {
  const modifiers = Object.entries(binding.modifiers).flatMap(([mod, val]) => `${mod}-${val}`)
  return camelize(['p', 'intersect', ...modifiers].join('-'))
}

function setKey(element: HTMLElement, binding: DirectiveBinding) {
  element.dataset[key(binding)] = String(uid++)
}

function getKey(element: HTMLElement, binding: DirectiveBinding): string {
  return element.dataset[key(binding)]!
}

function mounted(element: HTMLElement, binding: DirectiveBinding<PIntersectProps>) {
  if (!binding.value) {
    return
  }
  setKey(element, binding)
  const mountedAt = Date.now()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      const trigger = () => {
        binding.value?.on?.(isIntersecting)
        if (binding.modifiers.once) {
          unmounted(element, binding)
        }
      }
      if (isIntersecting) {
        binding.modifiers.delay && Date.now() - mountedAt > IMMEDIATELY_VISIBLE_TIME
          ? (timeouts[getKey(element, binding)] = window.setTimeout(trigger, TIME_IN_VIEWPORT))
          : trigger()
      } else {
        if (!binding.modifiers.visible) {
          trigger()
        }
        window.clearTimeout(timeouts[getKey(element, binding)])
        delete timeouts[getKey(element, binding)]
      }
    })
  }, binding.value.options)
  observer.observe(element)
  observers[getKey(element, binding)] = observer
}

function unmounted(element: HTMLElement, binding: DirectiveBinding) {
  const observer = observers[getKey(element, binding)]
  if (observer) {
    observer.unobserve(element)
    observer.disconnect()
    delete observers[getKey(element, binding)]
    delete timeouts[getKey(element, binding)]
    delete element.dataset[key(binding)]
  }
}

const PIntersect: ObjectDirective<HTMLElement, PIntersectProps> = {
  mounted,
  unmounted
}

export default PIntersect
