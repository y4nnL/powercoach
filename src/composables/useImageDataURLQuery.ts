import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

export function useImageDataURLQuery(src: string): UseQueryReturnType<string, Error> {
  function load(): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(xhr.response)
      }
      xhr.onerror = reject
      xhr.open('GET', src)
      xhr.responseType = 'blob'
      xhr.send()
    })
  }

  return useQuery<string>({
    queryKey: ['imageDataURL', src],
    queryFn: load,
    retry: 1,
    retryDelay: 1000,
    enabled: false
  })
}
