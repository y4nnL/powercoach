import { useQuery } from '@tanstack/vue-query'
import api from '@/api'

export function useVideosQuery() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: api.getVideos
  })
}
