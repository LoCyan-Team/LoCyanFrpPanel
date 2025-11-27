<template>
  <!-- CAPJS invisible mode -->
  <cap-widget v-if="isClient" id="cap" style="display: none" @solve="callback" />
</template>

<script setup lang="ts">
import type { Cap, SolveResult } from '@cap.js/widget'

let instance: Cap | null = null
const isClient = ref(false)

const env = {
  endpoint: import.meta.env.VITE_CAP_JS_ENDPOINT,
  siteKey: import.meta.env.VITE_CAP_JS_SITE_KEY
}

window.CAP_CUSTOM_WASM_URL = `${env.endpoint}/assets/cap_wasm.js`

const emit = defineEmits<{
  (e: 'error' | 'callback', errorOrToken: string): void
  (e: 'unsupported'): void
}>()

function callback(event: SolveResult) {
  if (event.success) {
    const token = event.token
    emit('callback', token)
  } else {
    emit('error', 'Captcha solve failed.')
  }
}

onMounted(async () => {
  isClient.value = true
  try {
    const module = await import('@cap.js/widget')
    instance = new module.default({
      apiEndpoint: `${env.endpoint}/${env.siteKey}/`
    })
  } catch (e) {
    console.error(e)
    emit('unsupported')
  }
})

// solve只负责触发cap的solve，返回由@callback返回
const solve = async () => {
  if (instance) {
    try {
      const event = await instance.solve()
      callback(event)
    } catch (e) {
      console.error(e)
      emit('error', 'Error happened while solving captcha.')
    }
  } else {
    emit('error', 'Instance not loaded.')
  }
}

defineExpose({
  solve
})
</script>
