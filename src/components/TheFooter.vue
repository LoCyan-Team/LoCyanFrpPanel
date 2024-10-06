<script setup lang="ts">
import { GitAlt } from '@vicons/fa'
import { onMounted, ref } from 'vue'
import { get } from '@/utils/request'

const gitHash = GIT_COMMITHASH
const nowYear = new Date().getFullYear()
const hitokoto_content = ref('Loading')

onMounted(async () => {
  let rs
  try {
    rs = await get('https://v1.hitokoto.cn/', {})
  } catch (e) {
    hitokoto_content.value = '加载失败'
  }
  if (!rs) {
    hitokoto_content.value = '加载失败'
    return
  }
  // 一言
  let content = rs.data.hitokoto
  let from = rs.data.from
  hitokoto_content.value = content + ' —— ' + from
})
</script>

<template>
  <div style="margin: 15px">
    <div style="text-align: center">
      <n-alert type="default" style="font-size: 20px; display: inline-block">
        <template #icon>
          <i class="twa-sm twa-speech-balloon"></i>
        </template>
        {{ hitokoto_content }}
      </n-alert>
      <br />
      <br />
      <span style="text-align: center">
        <a target="_blank" href="https://内网穿透.中国/">
          <n-button text>内网穿透联盟[CFU]</n-button>
        </a>
        识别码:
        <b>JRXHB5D4</b>
      </span>
      <br />
      <span style="text-align: center">© {{ nowYear }} LoCyanTeam。保留所有权利。</span>
      <br />
      <span style="text-align: center">
        <a target="_blank" href="https://www.locyan.cn/doc/yhfw.html"> 服务条款 </a>
        |
        <a target="_blank" href="https://www.locyan.cn/doc/yszc.html"> 隐私政策 </a>
        |
        <a target="_blank" href="https://github.com/LoCyan-Team/LoCyanFrpPanel">
          <n-button text style="transform: translateY(4.5px)">
            <template #icon>
              <n-icon>
                <git-alt />
              </n-icon>
            </template>
            {{ gitHash }}
          </n-button>
        </a>
      </span>
      <br />
      <br />
      <span style="text-align: center"
        >"Minecraft" 为美国微软公司的商标，本站与其没有任何从属关系</span
      >
      <br />
    </div>
  </div>
</template>
