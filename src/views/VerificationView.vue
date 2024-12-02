<template>
  <template v-if="loading">
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="primary"> 身份认证</n-text>
    </n-h1>
    <n-grid cols="1" item-responsive>
      <n-grid-item span="1">
        <n-card>
          <n-skeleton text :repeat="3" />
        </n-card>
      </n-grid-item>
    </n-grid>
  </template>
  <template v-else>
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="primary"> 身份认证</n-text>
    </n-h1>
    <n-collapse default-expanded-names="1" accordion v-show="!showFinishModal">
      <n-collapse-item title="实名认证 （二级认证，可使用海外节点）" name="1">
        <n-grid cols="1" item-responsive>
          <n-gi span="1" v-show="showRealnameModal">
            <n-card title="实名认证">
              <n-form :ref="formRef" :model="userProfile" label-width="auto" :size="'large'">
                <n-grid cols="1" item-responsive :y-gap="5">
                  <n-grid-item>
                    <p style="color: red">
                      请填写您的姓名和身份证号进行实名认证（请认真填写，实名一旦成功除特殊情况外无法修改）
                    </p>
                    <p>
                      若点击提交后 5
                      秒内没有回调信息出现，请再次点击按钮，直到出现提示框。若无法实名，请联系管理员解决！
                    </p>
                    <p>
                      本站全部个人隐私信息遵守
                      <a
                        style="color: dodgerblue"
                        href="https://www.locyan.cn/doc/yszc.html"
                        target="_blank"
                        >LoCyan 隐私协议</a
                      >
                      的约束，我们将最大限度的保护用户的个人信息数据
                    </p>
                    <p>
                      我们允许<a style="color: red"><b>未成年人注册</b></a
                      >，请勿冒用非本人身份证实名，已经实名过得既往不咎！
                    </p>
                  </n-grid-item>
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
                <div style="display: flex; justify-content: flex-end">
                  <n-button round type="primary" @click="submitRealName()"> 提交 </n-button>
                </div>
              </n-form>
            </n-card>
          </n-gi>
          <n-gi cols="1" item-responsive>
            <n-card v-show="!showRealnameModal">
              <i class="twa twa-2x twa-party-popper"></i>您已经完成实名认证！
            </n-card>
          </n-gi>
        </n-grid>
      </n-collapse-item>
      <n-collapse-item title="实人认证（一级认证，可使用全部节点）" name="2">
        <n-grid cols="1" item-responsive>
          <n-gi span="1">
            <n-card v-show="showRealpersonMoal && !showPayModal" title="实人认证">
              <n-form :ref="formRef" :model="userProfile" label-width="auto" :size="'large'">
                <n-grid cols="1" item-responsive :y-gap="5">
                  <n-grid-item>
                    <p style="color: red">
                      请填写您的姓名和身份证号进行实人认证（请认真填写，实人一旦成功除特殊情况外无法修改）
                    </p>
                    <p>
                      若点击提交后 5
                      秒内没有回调信息出现，请再次点击按钮，直到出现提示框。若无法实名，请联系管理员解决！
                    </p>
                    <p>
                      本站全部个人隐私信息遵守
                      <a
                        style="color: dodgerblue"
                        href="https://www.locyan.cn/doc/yszc.html"
                        target="_blank"
                        >LoCyan 隐私协议</a
                      >
                      的约束，我们将最大限度的保护用户的个人信息数据
                    </p>
                    <p>
                      我们允许<a style="color: red"><b>未成年人注册</b></a
                      >，请勿冒用非本人身份证实名，已经实名过得既往不咎！
                    </p>
                    <p>
                      注意，点击提交后会消耗实人次数，若不小心刷新页面且不想二次付费，请找管理员处理并附支付订单截图
                    </p>
                  </n-grid-item>
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
                <div style="display: flex; justify-content: flex-end">
                  <n-button round type="primary" @click="submitRealPerson()"> 提交 </n-button>
                </div>
              </n-form>
            </n-card>
            <n-card title="支付订单" v-show="showPayModal">
              <div style="text-align: center">
                <n-space justify="vertical">
                  <n-button type="primary" @click="realPersonPay()"> 点此付款 </n-button>
                  <n-button type="primary" @click="checkVerificationStatus()">
                    刷新付款状态
                  </n-button>
                </n-space>
              </div>
            </n-card>
          </n-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
    <n-grid cols="1" item-responsive>
      <n-gi span="1" v-show="showFinishModal">
        <n-card title="认证完成">
          <p>恭喜完成全部认证流程</p>
        </n-card>
      </n-gi>
    </n-grid>
  </template>
  <n-modal
    v-model:show="showScanCodeModal"
    :mask-closable="false"
    preset="card"
    :style="bodyStyle"
    title="请使用支付宝扫描二维码"
    size="huge"
    :bordered="false"
    :segmented="segmented"
  >
    <n-space justify="vertical">
      <n-qr-code :value="realPersonUrl" :size="200" :error-correction-level="'L'" />
    </n-space>
    <template #footer>
      <n-button type="primary" @click="queryRealPersonStatus()">点此刷新实人状态</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { sendErrorMessage } from '@/utils/message'
import { sendSuccessDialog, sendWarningDialog } from '@/utils/dialog'
import { finishLoadingBar, startLoadingBar, errorLoadingBar } from '@/utils/loadingbar'
import userData from '@/utils/stores/userData/store'
import api from '@/api'
import logger from '@/utils/logger'

const loading = ref(true)
const showRealnameModal = ref(true)
const showRealpersonMoal = ref(true)
const showPayModal = ref(false)
const showFinishModal = ref(false)
const showScanCodeModal = ref(false)
const formRef = ref(null)
const realName = ref(false)
const realPersonCount = ref(0)
const realPerson = ref(false)
const realPersonUrl = ref('')
const ci = ref('')
const userProfile = ref({
  name: '',
  idCard: ''
})
const bodyStyle = {
  width: '600px'
}
const segmented = {
  content: 'soft',
  footer: 'soft'
}

async function submitRealName() {
  startLoadingBar()
  const submitForm = {
    user_id: userData.getters.get_user_id,
    name: userProfile.value.name,
    id_card: userProfile.value.idCard
  }
  let rs
  try {
    rs = await api.v2.verification.realname(submitForm.user_id, submitForm.name, submitForm.id_card)
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) {
    errorLoadingBar()
    return
  }
  if (rs.status === 200) {
    checkVerificationStatus()
    finishLoadingBar()
    sendSuccessDialog('恭喜, 二级认证成功!')
  } else {
    finishLoadingBar()
    sendWarningDialog(rs.message)
  }
}

async function submitRealPerson() {
  startLoadingBar()
  const submitForm = {
    user_id: userData.getters.get_user_id,
    name: userProfile.value.name,
    id_card: userProfile.value.idCard
  }
  let rs
  try {
    rs = await api.v2.verification.realperson.root.post(
      submitForm.user_id,
      submitForm.name,
      submitForm.id_card
    )
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) {
    errorLoadingBar()
    return
  }
  if (rs.status === 200) {
    realPersonUrl.value = rs.data.url
    ci.value = rs.data.certify_id
    showScanCodeModal.value = true
    const queryRealPersonInterval = setInterval(() => {
      queryRealPersonStatus()
      if (realPerson.value === true) {
        finishLoadingBar()
        clearInterval(queryRealPersonInterval)
      }
    }, 5000)
  } else {
    sendErrorMessage('发生错误: ' + rs.message)
    finishLoadingBar()
  }
}

async function queryRealPersonStatus() {
  let rs
  try {
    rs = await api.v2.verification.realperson.query(userData.getters.get_user_id, ci.value)
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) return
  if (res.status === 200) {
    // 后端会处理所有审核通过的事宜，前端处理消息显示
    sendSuccessDialog('一级认证成功')
    showScanCodeModal.value = false
    checkVerificationStatus()
  }
}

async function checkVerificationStatus() {
  let rs
  try {
    rs = await api.v2.verification.root.get(userData.getters.get_user_id)
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) return
  // 如果已经完成实名，那么关闭实名的框，展示实人的框
  realName.value = rs.data.real_name
  realPersonCount.value = rs.data.real_person_count
  realPerson.value = rs.data.real_person

  // 实名和实人都完成则展示最终窗口
  if (realName.value === true && realPerson.value === true) {
    showFinishModal.value = true
    showRealnameModal.value = false
    showRealpersonMoal.value = false
    showPayModal.value = false
  }

  // 实名完成但是实人没有完成，展示实人窗口关闭实名窗口
  if (realName.value === true && realPerson.value === false) {
    showFinishModal.value = false
    showRealnameModal.value = false
    // 实人次数足够展示实人，不够展示支付
    logger.info('剩余实人次数: ' + realPersonCount.value)
    if (realPersonCount.value < 1) {
      showRealpersonMoal.value = false
      showPayModal.value = true
    } else {
      showRealpersonMoal.value = true
      showPayModal.value = false
    }
  }

  // 两个都没完成则全部展示
  if (realName.value === false && realPerson.value === false) {
    showFinishModal.value = false
    showRealnameModal.value = true
    // 实人次数足够展示实人，不够展示支付
    if (realPersonCount.value < 1) {
      showRealpersonMoal.value = false
      showPayModal.value = true
    } else {
      showRealpersonMoal.value = true
      showPayModal.value = false
    }
  }
  loading.value = false
}

async function realPersonPay() {
  let rs
  try {
    rs = await api.v2.verification.realperson.pay(userData.getters.get_user_id)
  } catch (e) {
    sendErrorMessage('请求失败: ' + e)
  }
  if (!rs) return
  if (rs.status === 200) {
    window.open(rs.data.url)
  }
}

checkVerificationStatus()
</script>
