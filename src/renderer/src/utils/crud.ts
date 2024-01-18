import type CRUD from '@renderer/api/CRUD'
import type { HandleType } from '@renderer/types'
import type { Pagination } from '@renderer/types/config'
import { ElMessage } from 'element-plus'
import { ref, toRefs, toValue, type Ref } from 'vue'
import { message } from '@renderer/utils/message'

const api = ref<CRUD>()
const queryData = ref()
const params = ref()
const total = ref(0)
const handleStatus = ref(false)
let addOrEditRef: undefined | Ref

const query = <T, P>(callback?: () => void) => {
  api.value?.fetchList<T & Partial<Pagination>, P>(toValue(params)).then(res => {
    queryData.value = res.data
    total.value = res.total || 0
    callback && callback()
  })
}

const edit = <T>(data: T, callback?: () => void) => {
  api.value?.update(data).then(res => {
    if (res.code === 0) {
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      callback && callback()
      query()
      handleStatus.value = false
      addOrEditRef?.value.reset()
    }
  })
}
const add = <T>(data: T, callback?: () => void) => {
  api.value?.create(data).then(res => {
    if (res.code === 0) {
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      callback && callback()
      query()
      handleStatus.value = false
      addOrEditRef?.value.reset()
    }
  })
}
const remove = (content: string, ids: number[], callback?: () => void) => {
  message(
    content,
    () => {
      api.value?.delete(ids).then(res => {
        if (res.code === 0) {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
          callback ? callback() : query()
        }
      })
    },
    '删除确认',
    '确认'
  )
}

const handleEditOrAdd = <T>(data?: T & object, handleType?: HandleType) => {
  handleStatus.value = true
  const initData = { ...data, handleType }
  addOrEditRef?.value.init(initData)
}

export const useCRUD = <T>(Api: CRUD, initialParams?: T & object, addOrEdit?: Ref) => {
  api.value = Api

  addOrEditRef = addOrEdit
  params.value = initialParams ? toRefs(initialParams) : {}

  return { query, queryData, total, edit, add, remove, handleStatus, handleEditOrAdd }
}
