import { ref } from 'vue'

type DbStateEnum = 'connected' | 'connecting' | 'error' | 'disconnected'

const dbState = ref<DbStateEnum>('disconnected')

const connectDb = async () => {
  if (['connected', 'connecting'].includes(dbState.value)) return

  dbState.value = 'connecting'
  const _db = await window.vegetable.db.init()

  dbState.value = _db.state
}

export const useDb = () => {
  return { dbState, connectDb }
}
