import { useQuery } from '@tanstack/vue-query'
import api from '@/api'
import type { Video, UseVideosQueryReturnType } from '@/types'

export function useVideosQuery(): UseVideosQueryReturnType {
  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: api.getVideos
  })
}
