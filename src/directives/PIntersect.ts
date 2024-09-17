import { camelize } from 'vue'
import type { Directive, DirectiveBinding } from 'vue'

const IMMEDIATELY_VISIBLE_TIME = 200
const TIME_IN_VIEWPORT = 500

const timeouts: Record<string, number> = {}
const observers: Record<string, IntersectionObserver> = {}

let uid: number = 1

function key(binding: DirectiveBinding): string {
  const modifiers = Object.entries(binding.modifiers)
    .flatMap(([m, v]) => `${m}-${v}`)
    .join('-')
  return camelize(['p', 'intersect', modifiers].join('-'))
}

function setKey(element: HTMLElement, binding: DirectiveBinding) {
  element.dataset[key(binding)] = String(uid++)
}

function getKey(element: HTMLElement, binding: DirectiveBinding): string {
  return element.dataset[key(binding)]!
}

function mounted(element: HTMLElement, binding: DirectiveBinding<(visible?: boolean) => any>) {
  setKey(element, binding)
  const mountedAt = Date.now()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      const trigger = () => {
        binding.value?.(isIntersecting)
        if (!binding.modifiers.keep) {
          unmounted(element, binding)
        }
      }
      if (isIntersecting) {
        binding.modifiers.immediate || Date.now() - mountedAt < IMMEDIATELY_VISIBLE_TIME
          ? trigger()
          : (timeouts[getKey(element, binding)] = window.setTimeout(trigger, TIME_IN_VIEWPORT))
      } else {
        if (binding.modifiers.both) {
          trigger()
        }
        window.clearTimeout(timeouts[getKey(element, binding)])
        delete timeouts[getKey(element, binding)]
      }
    })
  })
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

const PIntersect: Directive<HTMLElement, () => any> = {
  mounted,
  unmounted
}

export default PIntersect
