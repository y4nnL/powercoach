import type { Directive, DirectiveBinding } from 'vue'

const VISIBLE_DELAY_THRESHOLD = 200
const VISIBLE_DELAY = 500

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
        Date.now() - mountedAt < VISIBLE_DELAY_THRESHOLD
          ? trigger()
          : (timeouts[element.dataset.pIntersect!] = window.setTimeout(trigger, VISIBLE_DELAY))
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
