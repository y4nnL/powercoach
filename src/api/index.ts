import { type API, type Video } from '@/types'
import videos from '@/api/fixtures/videos'

const pause = async () => new Promise((resolve) => window.setTimeout(resolve, 1000))

const api: API = {
  getVideo: async (id: string): Promise<Video> => {
    await pause()
    return new Promise((resolve, reject) => {
      const foundVideo = videos.find((video) => video.id === id)
      foundVideo ? resolve(foundVideo) : reject()
    })
  },
  getVideos: async (): Promise<Video[]> => {
    await pause()
    return new Promise((resolve) => {
      resolve(videos)
    })
  }
}

export default api
