<template>
  <div class="not-find">
    <img src="@renderer/assets/images/404/404.png" alt="" style="width: 400px" />
    <div class="not-find-text">页面不小心迷路了</div>
  </div>
</template>
<route> { meta: { layout: false } } </route>

<style lang="scss" scoped>
.not-find {
  width: 400px;
  margin: 0 auto;
  text-align: center;
  &-text {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
}
</style>
