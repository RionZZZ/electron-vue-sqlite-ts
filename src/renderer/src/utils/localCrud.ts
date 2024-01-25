import type { HandleType } from '@renderer/types'
import { ElMessage } from 'element-plus'
import { ref, type Ref } from 'vue'
import { message } from '@renderer/utils/message'

const api = ref<VegetableCurd<any>>()
const queryData = ref()
const total = ref(0)
const handleStatus = ref(false)
let params
let addOrEditRef: undefined | Ref

const query = () => {
  api.value?.findAndCountAll(params).then(res => {
    console.log(res)

    queryData.value = res.rows.map(user => user.dataValues)
    total.value = res.count
  })
}

const queryAll = () => {
  api.value?.findAll(params).then(res => {
    queryData.value = res
  })
}

const edit = (data, callback?: () => void) => {
  api.value?.update(data).then(res => {
    ElMessage({
      message: res.msg,
      type: 'success'
    })
    callback && callback()
    query()
    handleStatus.value = false
    addOrEditRef?.value.reset()
  })
}
const add = (data, callback?: () => void) => {
  api.value?.create(data).then(res => {
    ElMessage({
      message: res.msg,
      type: 'success'
    })
    callback && callback()
    query()
    handleStatus.value = false
    addOrEditRef?.value.reset()
  })
}
const remove = (content: string, ids: number[], callback?: () => void) => {
  message(
    content,
    () => {
      // api.value?.delete(ids).then(res => {
      //   if (res.code === 0) {
      //     ElMessage({
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     callback ? callback() : query()
      //   }
      // })
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
  api.value = Api
  addOrEditRef = addOrEdit
  params = initialParams || {}

  return { query, queryAll, queryData, total, edit, add, remove, handleStatus, handleEditOrAdd }
}
