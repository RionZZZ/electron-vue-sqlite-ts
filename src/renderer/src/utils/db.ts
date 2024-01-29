import { ref } from 'vue'

type DbStateEnum = 'connected' | 'connecting' | 'error' | 'disconnected'

const dbState = ref<DbStateEnum>('disconnected')

const connectDb = () => {
  if (['connected', 'connecting'].includes(dbState.value)) {
    return
  }

  dbState.value = 'connecting'
  setTimeout(async () => {
    const _db = await window.vegetable.db.init()
    dbState.value = _db.state
  }, 2000)
}

export const useDb = () => {
  return { dbState, connectDb }
}
