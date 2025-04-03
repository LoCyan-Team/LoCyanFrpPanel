<template>
  <div class="image-marker">
    <img :src="'data:image/jpeg;base64,' + smallImageSrc" />
    <div class="image-container" ref="container">
      <img :src="'data:image/jpeg;base64,' + bigImageSrc" alt="点击图片标记位置" @click="handleImageClick" ref="image" />
      <div v-for="(marker, index) in markers" :key="index" class="marker" :style="{
    left: `${marker.x}px`,
    top: `${marker.y}px`,
    backgroundColor: markerColors[index % markerColors.length]
  }">
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue' // 添加 watch 导入

const emit = defineEmits(['update:markers'])

const props = defineProps({
  smallImageSrc: {
    type: String,
    required: true
  },
  bigImageSrc: {
    type: String,
    required: true
  },
  maxMarkers: {
    type: Number,
    default: 4
  }
})

const container = ref(null)
const image = ref(null)
const markers = ref([])

const markerColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'] // 改为蓝色系

// 添加图片变化监听
watch(() => props.bigImageSrc, () => {
  markers.value = [] // 清空所有标记点
})

const handleImageClick = (event) => {
  const rect = image.value.getBoundingClientRect()
  const scaleX = image.value.naturalWidth / rect.width
  const scaleY = image.value.naturalHeight / rect.height

  const x = Math.round((event.clientX - rect.left) * scaleX)
  const y = Math.round((event.clientY - rect.top) * scaleY)

  markers.value.push({ x, y })
  if (markers.value.length === 4) {
    emit('update:markers', markers.value)
  }
}
</script>

<style scoped>
.image-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  cursor: crosshair;
  max-width: 100%;
  height: auto;
}

.marker {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  border: 2px solid white;
}
</style>