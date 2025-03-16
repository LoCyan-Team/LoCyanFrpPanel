<template>
  <template v-if="loading">
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="success"> 身份认证</n-text>
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
      <n-text type="success"> 身份认证</n-text>
    </n-h1>
    <n-collapse default-expanded-names="1" accordion v-if="!finished">
      <!-- 二级认证 -->
      <n-collapse-item title="实名认证 （二级认证，可使用海外节点）" name="1">
        <n-grid cols="1" item-responsive>
          <n-gi span="1" v-if="showRealnameModal">
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
                  <n-button round type="success" @click="submitRealName()"> 提交 </n-button>
                </div>
              </n-form>
            </n-card>
          </n-gi>
          <n-gi cols="1" item-responsive v-else>
            <n-card> <i class="twa twa-2x twa-party-popper"></i>您已经完成实名认证！ </n-card>
          </n-gi>
        </n-grid>
      </n-collapse-item>
      <!-- 一级认证 -->
      <n-collapse-item title="实人认证（一级认证，可使用全部节点）" name="2">
        <n-grid cols="1" item-responsive>
          <n-gi span="1">
            <n-card title="支付订单" v-if="showPayModal">
              <div>
                <n-space>
                  <n-button type="success" @click="realPersonPay()"> 点此付款 </n-button>
                  <n-button type="success" @click="checkVerificationStatus()">
                    刷新付款状态
                  </n-button>
                </n-space>
              </div>
            </n-card>
            <n-card title="实人认证" v-if="showRealpersonModal">
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
                      若认证失败，请先点击<b>重置验证状态</b>重置状态，再重新发起认证！
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
                <div>
                  <n-space>
                    <n-button type="success" @click="submitRealPerson()">提交</n-button>
                    <n-button type="success" @click="queryRealPersonStatus()" secondary>
                      刷新状态
                    </n-button>
                    <n-button type="error" @click="resetRealPersonStatus()" secondary>
                      重置验证状态
                    </n-button>
                  </n-space>
                </div>
              </n-form>
            </n-card>
          </n-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
    <!-- 认证成功 -->
    <n-grid cols="1" item-responsive>
      <n-gi span="1" v-if="finished">
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

const ldb = useLoadingBar()
const api = new API()
const message = new Message()
const dialog = new Dialog()

const loading = ref(true)
const finished = ref(false)

const showRealnameModal = ref(true),
  showRealpersonModal = ref(true)

const showPayModal = ref(false)
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
  realPersonCount.value = rs.data.real_person_count
  realPerson.value = rs.data.real_person

  // 实名和实人都完成则展示最终窗口
  if (realName.value === true && realPerson.value === true) {
    finished.value = true
    showRealnameModal.value = false
    showRealpersonModal.value = false
    showPayModal.value = false
  }

  // 实名完成但是实人没有完成，展示实人窗口关闭实名窗口
  if (realName.value === true && realPerson.value === false) {
    finished.value = false
    showRealnameModal.value = false
    // 实人次数足够展示实人，不够展示支付
    logger.info('剩余实人次数: ' + realPersonCount.value)
    if (realPersonCount.value < 1) {
      showRealpersonModal.value = false
      showPayModal.value = true
    } else {
      showRealpersonModal.value = true
      showPayModal.value = false
    }
  }

  // 两个都没完成则全部展示
  if (realName.value === false && realPerson.value === false) {
    finished.value = false
    showRealnameModal.value = true
    // 实人次数足够展示实人，不够展示支付
    if (realPersonCount.value < 1) {
      showRealpersonModal.value = false
      showPayModal.value = true
    } else {
      showRealpersonModal.value = true
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
</script>
