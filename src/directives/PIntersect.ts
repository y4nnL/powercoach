import type { Directive, DirectiveBinding } from 'vue'

const IMMEDIATELY_VISIBLE_TIME = 200
const TIME_IN_VIEWPORT = 500

const timeouts: Record<string, number> = {}
const observers: Record<string, IntersectionObserver> = {}

let uid: number = 1

function mounted(element: HTMLElement, binding: DirectiveBinding<() => any>) {
  element.dataset.pIntersect = String(uid++)
  const mountedAt = Date.now()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting }) => {
      const trigger = () => {
        binding.value?.()
        unmounted(element)
      }
      if (isIntersecting) {
        Date.now() - mountedAt < IMMEDIATELY_VISIBLE_TIME
          ? trigger()
          : (timeouts[element.dataset.pIntersect!] = window.setTimeout(trigger, TIME_IN_VIEWPORT))
      } else {
        window.clearTimeout(timeouts[element.dataset.pIntersect!])
        delete timeouts[element.dataset.pIntersect!]
      }
    })
  })
  observer.observe(element)
  observers[element.dataset.pIntersect!] = observer
}

function unmounted(element: HTMLElement) {
  const observer = observers[element.dataset.pIntersect!]
  if (observer) {
    observer.unobserve(element)
    observer.disconnect()
    delete observers[element.dataset.pIntersect!]
    delete timeouts[element.dataset.pIntersect!]
    delete element.dataset.pIntersect
  }
}

const PIntersect: Directive<HTMLElement, () => any> = {
  mounted,
  unmounted
}

export default PIntersect
