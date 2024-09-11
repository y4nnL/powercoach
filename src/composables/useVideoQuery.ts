import { useQuery } from '@tanstack/vue-query'
import api from '@/api'

export function useVideoQuery(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => api.getVideo(id)
  })
}
