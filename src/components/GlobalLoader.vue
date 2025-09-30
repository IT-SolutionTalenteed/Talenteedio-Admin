<template>
  <div class="global-loader">
    <div class="page page-center">
      <div class="container container-slim py-4">
        <div class="text-center">
          <div class="mb-4">
            <a href="." class="navbar-brand navbar-brand-autodark"
              ><img src="/talenteed.png" height="36" alt=""
            /></a>
          </div>
          <div class="progress progress-sm">
            <div class="progress-bar progress-bar-indeterminate"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scopped>
.global-loader {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1059;
  background-color: white;
}
</style>
