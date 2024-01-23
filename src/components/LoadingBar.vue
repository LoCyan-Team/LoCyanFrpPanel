<template></template>

<script>
import { defineComponent } from 'vue'
import { useLoadingBar } from 'naive-ui'

// content
export default defineComponent({
  setup() {
    window.$loadingBar = useLoadingBar()
  }
})
</script>
