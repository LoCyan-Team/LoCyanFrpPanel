<template></template>

<script>
import { defineComponent } from 'vue'
import { useDialog } from 'naive-ui'

// content
export default defineComponent({
  setup() {
    window.$dialog = useDialog()
  }
})
</script>
