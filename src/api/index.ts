import { type API, type Video } from '@/types'
import videos from '@/api/fixtures/videos'

const pause = async () => new Promise((resolve) => window.setTimeout(resolve, 1000))

const api: API = {
  getVideo: async (id: string): Promise<Video> => {
    await pause()
    const foundVideo = videos.find((video) => video.id === id)
    if (!foundVideo) {
      throw new Error(`Video ${id} not found`)
    }
    return foundVideo
  },
  getVideos: async (): Promise<Video[]> => {
    await pause()
    return videos
  }
}

export default api
