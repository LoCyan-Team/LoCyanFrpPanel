<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-card-file-box"></i>
    <n-text type="success"> 身份认证</n-text>
  </n-h1>
  <n-space vertical>
    <n-alert title="说明" type="info">
      请填写您的姓名和身份证号进行身份认证（请认真填写，认证一旦成功除特殊情况外无法修改）
      <br />本站全部个人隐私信息遵守
      <a href="https://terms.locyan.cn/privacy-policy" target="_blank">LoCyan 隐私政策</a>
      的约束，我们将最大限度的保护用户的个人信息数据
    </n-alert>
    <n-alert title="请勿冒用他人信息实名" type="warning">
      我们允许未成年人注册，请勿冒用非本人身份证实名，已经实名过得既往不咎！
    </n-alert>
    <n-spin :show="loading">
      <n-card title="认证总览">
        <n-h4>认证说明</n-h4>
        二级认证可使用二级认证节点，一级认证可使用二级认证及一级认证节点。
        <br />您需要先完成二级认证才能进行一级认证。
        <n-h4>认证状态</n-h4>
        <n-space vertical>
          <n-el>
            二级认证:
            <n-tag type="warning" v-if="!realName">未通过</n-tag>
            <n-tag type="success" v-if="realName">已通过</n-tag>
          </n-el>
          <n-el>
            一级认证:
            <n-tag type="warning" v-if="!realPerson">未通过</n-tag>
            <n-tag type="success" v-if="realPerson">已通过</n-tag>
          </n-el>
        </n-space>
      </n-card>
      <br />
      <n-grid :y-gap="2" :x-gap="20" cols="2" item-responsive>
        <!-- 二级认证 -->
        <n-grid-item span="0:2 800:1">
          <n-card title="实名认证（二级认证）">
            <n-spin :show="realName" :rotate="false">
              <template #icon>
                <n-icon>
                  <FileDownloadDoneOutlined />
                </n-icon>
              </template>
              <template #description> 已完成 </template>
              <n-form :ref="formRef" :model="userProfile" label-width="auto" :size="'large'">
                <n-grid cols="1" item-responsive :y-gap="5">
                  <n-grid-item span="1">
                    <n-form-item label="姓名" path="name">
                      <n-input v-model:value="userProfile.name" placeholder="您的姓名" />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="1">
                    <n-form-item label="身份证号" path="idcard">
                      <n-input v-model:value="userProfile.idCard" placeholder="您的身份证号" />
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
                <n-button type="success" @click="submitRealName()">提交</n-button>
              </n-form>
            </n-spin>
          </n-card>
          <br />
          <n-thing>
            <!-- 身份验证界面广告 -->
            <ins
              class="adsbygoogle"
              style="display: block"
              data-ad-client="ca-pub-9138537301722383"
              data-ad-slot="8862748131"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </n-thing>
          <br />
        </n-grid-item>

        <!-- 一级认证 -->
        <n-grid-item span="0:2 800:1">
          <n-card title="实人认证（一级认证）">
            <n-space vertical>
              <n-spin :show="!showPayModal || realPerson" :rotate="false">
                <template #icon>
                  <n-icon>
                    <FileDownloadDoneOutlined />
                  </n-icon>
                </template>
                <template #description> 已完成 </template>
                <n-card title="购买认证次数">
                  <n-space>
                    <n-button type="success" @click="realPersonPay()"> 点此付款 </n-button>
                    <n-button type="success" @click="checkVerificationStatus()">
                      刷新付款状态
                    </n-button>
                  </n-space>
                </n-card>
              </n-spin>
              <n-alert title="认证失败重新发起方式" type="error">
                若认证失败，请先点击
                <n-tag>重置验证状态</n-tag>
                重置状态，再重新发起认证！
              </n-alert>
              <n-spin :show="realPerson" :rotate="false">
                <template #icon>
                  <n-icon>
                    <FileDownloadDoneOutlined />
                  </n-icon>
                </template>
                <template #description> 已完成 </template>
                <n-card title="提交认证">
                  <n-form :ref="formRef" :model="userProfile" label-width="auto" :size="'large'">
                    <n-grid cols="1" item-responsive :y-gap="5">
                      <n-grid-item span="1">
                        <n-form-item label="姓名" path="name">
                          <n-input v-model:value="userProfile.name" placeholder="您的姓名" />
                        </n-form-item>
                      </n-grid-item>
                      <n-grid-item span="1">
                        <n-form-item label="身份证号" path="idcard">
                          <n-input v-model:value="userProfile.idCard" placeholder="您的身份证号" />
                        </n-form-item>
                      </n-grid-item>
                    </n-grid>
                    <n-space>
                      <n-button type="success" @click="submitRealPerson()">提交</n-button>
                      <n-button type="success" @click="queryRealPersonStatus()" secondary>
                        刷新状态
                      </n-button>
                      <n-button type="error" @click="resetRealPersonStatus()" secondary>
                        重置验证状态
                      </n-button>
                    </n-space>
                  </n-form>
                </n-card>
              </n-spin>
            </n-space>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-spin>
  </n-space>
  <n-modal
    v-model:show="showScanCodeModal"
    :mask-closable="false"
    preset="card"
    style="max-width: 600px"
    title="请使用支付宝扫描二维码"
    :bordered="false"
    :segmented="segmented"
    content-style="text-align: center;"
    footer-style="text-align: center;"
  >
    <n-qr-code :value="realPersonUrl" :size="200" :error-correction-level="'L'" />
    <template #footer>
      <n-button type="success" @click="queryRealPersonStatus()">刷新状态</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import Message from '@/utils/message'
import Dialog from '@/utils/dialog'
import userData from '@/utils/stores/userData/store'
import API from '@/api'
import logger from '@/utils/logger'
import { useLoadingBar } from 'naive-ui'
import { FileDownloadDoneOutlined } from '@vicons/material'

const ldb = useLoadingBar()
const api = new API()
const message = new Message()
const dialog = new Dialog()

const loading = ref(true)
const finished = ref(false)

const showPayModal = ref(false)
const showScanCodeModal = ref(false)

const formRef = ref(null)
const realName = ref(false),
  realPerson = ref(false)
const realPersonCount = ref(0)
const realPersonUrl = ref('')
const ci = ref('')
const userProfile = ref({
  name: '',
  idCard: ''
})
const segmented = {
  content: 'soft',
  footer: 'soft'
}

async function submitRealName() {
  ldb.start()
  let rs
  try {
    rs = await api.v2.verification.realname.post({
      userId: userData.getters.get_user_id,
      name: userProfile.value.name,
      idCard: userProfile.value.idCard
    })
  } catch (e) {
    logger.error(e)
    message.error('请求失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    checkVerificationStatus()
    ldb.finish()
    message.success('恭喜, 二级认证成功!')
  } else {
    ldb.finish()
    message.warning(rs.message)
  }
}

async function submitRealPerson() {
  ldb.start()
  let rs
  try {
    rs = await api.v2.verification.realperson.post({
      userId: userData.getters.get_user_id,
      name: userProfile.value.name,
      idCard: userProfile.value.idCard
    })
  } catch (e) {
    logger.error(e)
    message.error('请求失败: ' + e)
  }
  if (!rs) {
    ldb.error()
    return
  }
  if (rs.status === 200) {
    realPersonUrl.value = rs.data.url
    ci.value = rs.data.certify_id
    showScanCodeModal.value = true
    ldb.finish()
  } else {
    message.error('发生错误: ' + rs.message)
    ldb.error()
  }
}

async function resetRealPersonStatus() {
  dialog.warning('确认要重置验证状态吗？此操作不可逆', {
    onPositiveClick: async () => {
      let rs
      try {
        rs = await api.v2.verification.realperson.delete({
          userId: userData.getters.get_user_id
        })
      } catch (e) {
        message.error('请求失败: ' + e)
      }
      if (!rs) return
      if (rs.status === 200) {
        message.success('重置成功')
      } else {
        message.error(rs.message)
      }
    }
  })
}

async function queryRealPersonStatus() {
  let rs
  try {
    rs = await api.v2.verification.realperson.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    message.error('请求失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    message.success('一级认证成功')
    showScanCodeModal.value = false
    await checkVerificationStatus()
  } else {
    message.error(rs.message)
  }
}

async function checkVerificationStatus() {
  let rs
  try {
    rs = await api.v2.verification.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    message.error('请求失败: ' + e)
  }
  if (!rs) return
  // 如果已经完成实名，那么关闭实名的框，展示实人的框
  realName.value = rs.data.real_name
  realPerson.value = rs.data.real_person
  realPersonCount.value = rs.data.real_person_count

  // 实名和实人都完成则展示最终窗口
  if (realName.value === true && realPerson.value === true) {
    finished.value = true
    showPayModal.value = false
  }

  // 实名完成但是实人没有完成，展示实人窗口关闭实名窗口
  if (realName.value === true && realPerson.value === false) {
    finished.value = false
    // 实人次数足够展示实人，不够展示支付
    logger.info('剩余实人次数: ' + realPersonCount.value)
    if (realPersonCount.value < 1) {
      showPayModal.value = true
    } else {
      showPayModal.value = false
    }
  }

  // 两个都没完成则全部展示
  if (realName.value === false && realPerson.value === false) {
    finished.value = false
    // 实人次数足够展示实人，不够展示支付
    if (realPersonCount.value < 1) {
      showPayModal.value = true
    } else {
      showPayModal.value = false
    }
  }
  loading.value = false
}

async function realPersonPay() {
  let rs
  try {
    rs = await api.v2.verification.realperson.pay.get({
      userId: userData.getters.get_user_id
    })
  } catch (e) {
    logger.error(e)
    message.error('请求失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.open(rs.data.url)
  } else {
    message.error(rs.message)
  }
}

checkVerificationStatus()

onMounted(() => window.addAdsenseAds())
</script>
