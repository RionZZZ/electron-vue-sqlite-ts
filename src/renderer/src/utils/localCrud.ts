import type { HandleType } from '@renderer/types'
import { ElMessage } from 'element-plus'
import { ref, toRaw, type Ref } from 'vue'
import { message } from '@renderer/utils/message'

const queryData = ref()
const total = ref(0)
const handleStatus = ref(false)
let api
let params
let addOrEditRef: undefined | Ref

const query = () => {
  api?.findAndCountAll(params).then(res => {
    queryData.value = res.data
    total.value = res.count
  })
}

const queryAll = () => {
  api?.findAll(params).then(res => {
    queryData.value = res
  })
}

const add = (data, callback?: () => void) => {
  api?.create(toRaw(data)).then(res => {
    if (res.code === 0) {
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      callback && callback()
      query()
      handleStatus.value = false
      addOrEditRef?.value.reset()
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}
const edit = (data, callback?: () => void) => {
  api?.update(toRaw(data)).then(res => {
    if (res.code === 0) {
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      callback && callback()
      query()
      handleStatus.value = false
      addOrEditRef?.value.reset()
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}
const remove = (content: string, ids: string[], callback?: () => void) => {
  message(
    content,
    () => {
      api?.destroy(ids).then(res => {
        if (res.code === 0) {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
          callback && callback()
        }
      })
    },
    '删除确认',
    '确认'
  )
}

const handleEditOrAdd = (handleType?: HandleType, data?) => {
  handleStatus.value = true
  const initData = { ...data, handleType }
  addOrEditRef?.value.init(initData)
}

export const useLocalCrud = <T>(Api: VegetableCurd<T>, initialParams?, addOrEdit?: Ref) => {
  api = Api
  addOrEditRef = addOrEdit
  params = initialParams || {}

  return { query, queryAll, queryData, total, edit, add, remove, handleStatus, handleEditOrAdd }
}
