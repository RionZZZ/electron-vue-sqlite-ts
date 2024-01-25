import { ElMessageBox } from 'element-plus'
import { h } from 'vue'

export const message = (
  text: string,
  callback: () => void,
  title: string | undefined = '提示',
  confirmBtn: string | undefined = '确定',
  subText: string | undefined = ''
) => {
  ElMessageBox({
    title,
    message: h('div', { style: 'margin: 20px 0 25px' }, [
      h('div', { style: 'line-height:24px;color: #666;font-size: 14px;' }, text),
      h('span', { style: 'color: #999;font-size: 12px;' }, subText)
    ]),
    showCancelButton: true,
    confirmButtonText: confirmBtn,
    cancelButtonText: '取消'
  })
    .then(() => {
      callback && callback()
    })
    .catch(() => {})
}
