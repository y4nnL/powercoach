export function usePointerEvents(enable: boolean) {
  const method = enable ? 'remove' : 'add'
  document.body.classList[method]('pe-none')
}
