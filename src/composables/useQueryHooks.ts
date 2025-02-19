import { type UseQueryReturnType } from '@tanstack/vue-query'
import { watch } from 'vue'

export type UseQueryHookCallback<T, E> = {
  onSuccess?: (data: T) => void
  onError?: (error: E) => void
}

export const useQueryHooks = <T, E = Error>(
  query: UseQueryReturnType<T, E>,
  callbacks: UseQueryHookCallback<T, E>
) => {
  watch(
    () => query.isSuccess.value,
    (isSuccess) => isSuccess && callbacks.onSuccess?.(query.data.value as T)
  )
  watch(
    () => query.isError.value,
    (isError) => isError && callbacks.onError?.(query.error.value as E)
  )
}
