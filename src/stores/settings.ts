import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export interface ISettings {
  video: {
    blockVideosPreview: Ref<number>
    weekVideosPreview: Ref<number>
    workoutVideosPreview: Ref<number>
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings: ISettings = {
    video: {
      blockVideosPreview: ref(9),
      weekVideosPreview: ref(6),
      workoutVideosPreview: ref(3)
    }
  }

  return { ...settings }
})
