<template>
  <template v-if="loading">
    <n-h1 prefix="bar" style="margin-top: 30px">
      <i class="twa twa-card-file-box"></i>
      <n-text type="primary"> 实名认证</n-text>
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
      <n-text type="primary"> 实名认证</n-text>
    </n-h1>
    <n-collapse default-expanded-names="1" accordion v-show="!showFinishModal">
      <n-collapse-item title="实名认证 （二级认证，可使用海外节点）" name="1">
        <n-grid cols="1" item-responsive>
          <n-gi span="1" v-show="showRealnameModal">
            <n-card title="实名认证">
              <n-form :ref="formRef" :model="UserProfile" label-width="auto" :size="'large'">
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
                      <a style="color: dodgerblue" href="https://www.locyan.cn/doc/yszc.html" target="_blank">LoCyan
                        隐私协议</a>
                      的约束，我们将最大限度的保护用户的个人信息数据
                    </p>
                    <p>
                      我们允许<a style="color: red"><b>未成年人注册</b></a>，请勿冒用非本人身份证实名，已经实名过得既往不咎！
                    </p>
                  </n-grid-item>
                  <n-grid-item span="1">
                    <n-form-item label="姓名" path="name">
                      <n-input v-model:value="UserProfile.name" placeholder="您的姓名" />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="1">
                    <n-form-item label="身份证号" path="idcard">
                      <n-input v-model:value="UserProfile.idcard" placeholder="您的身份证号" />
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
                <div style="display: flex; justify-content: flex-end">
                  <n-button round type="primary" @click="submitrealname()"> 提交 </n-button>
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
              <n-form :ref="formRef" :model="UserProfile" label-width="auto" :size="'large'">
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
                      <a style="color: dodgerblue" href="https://www.locyan.cn/doc/yszc.html" target="_blank">LoCyan
                        隐私协议</a>
                      的约束，我们将最大限度的保护用户的个人信息数据
                    </p>
                    <p>
                      我们允许<a style="color: red"><b>未成年人注册</b></a>，请勿冒用非本人身份证实名，已经实名过得既往不咎！
                    </p>
                    <p>
                      注意，点击提交后会消耗实人次数，若不小心刷新页面且不想二次付费，请找管理员处理并附支付订单截图
                    </p>
                  </n-grid-item>
                  <n-grid-item span="1">
                    <n-form-item label="姓名" path="name">
                      <n-input v-model:value="UserProfile.name" placeholder="您的姓名" />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="1">
                    <n-form-item label="身份证号" path="idcard">
                      <n-input v-model:value="UserProfile.idcard" placeholder="您的身份证号" />
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
                <div style="display: flex; justify-content: flex-end">
                  <n-button round type="primary" @click="submitrealperson()"> 提交 </n-button>
                </div>
              </n-form>
            </n-card>
            <n-card title="支付订单" v-show="showPayModal">
              <div style="text-align: center;">
                <n-space justify="vertical">
                  <n-button type="primary" @click="realPersonPay();">
                    点此付款
                  </n-button>
                  <n-button type="primary" @click="CheckRealNameStatus();">
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
          <n-h1>
            恭喜完成全部认证流程
          </n-h1>
        </n-card>
      </n-gi>
    </n-grid>
  </template>
  <n-modal v-model:show="showScanCodeModal" :mask-closable="false" preset="card" :style="bodyStyle" title="请使用支付宝扫描二维码"
    size="huge" :bordered="false" :segmented="segmented">
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
import { SendErrorDialog, SendSuccessDialog, SendWarningDialog } from '../utils/dialog'
import { FinishLoadingBar, StartLoadingBar } from '../utils/loadingbar'
import { get, post } from '../utils/request.js'
import store from '../utils/stores/store.js'

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
const realPersonUrl = ref("")
const ci = ref("")
const payUrl = ref("")
const UserProfile = ref({
  name: '',
  idcard: ''
})
const bodyStyle = {
  width: "600px"
}
const segmented = {
  content: "soft",
  footer: "soft"
}

function submitrealname() {
  StartLoadingBar()
  const SubmitForm = {
    username: store.getters.get_username,
    name: UserProfile.value.name,
    id_card: UserProfile.value.idcard
  }
  const rs = post('https://api-v2.locyanfrp.cn/api/v2/realname/submit', SubmitForm)
  rs.then((res) => {
    if (res.status === 200) {
      CheckRealNameStatus()
      FinishLoadingBar()
      SendSuccessDialog("恭喜, 实名认证成功!")
    } else {
      FinishLoadingBar()
      SendWarningDialog(res.data.msg)
    }
  })
}

function submitrealperson() {
  const SubmitForm = {
    username: store.getters.get_username,
    name: UserProfile.value.name,
    id_card: UserProfile.value.idcard,
  }
  const rs = post("https://api-v2.locyanfrp.cn/api/v2/realperson/submit", SubmitForm)
  rs.then((res) => {
    if (res.status === 200){
      realPersonUrl.value = res.data.url
      ci.value = res.data.certify_id
      showScanCodeModal.value = true
      const queryRealPersonInterval = setInterval(() => {
        queryRealPersonStatus()
        if (realPerson.value === true){
          clearInterval(queryRealPersonInterval);
        }
      }, 5000)
    }
  })
}

function queryRealPersonStatus(){
  const rs = get("https://api-v2.locyanfrp.cn/api/v2/realperson/query?username=" + store.getters.get_username + "&certify_id=" + ci.value)
  rs.then((res) => {
    if (res.status === 200){
      // 后端会处理所有审核通过的事宜，前端处理消息显示
      SendSuccessDialog("实人成功")
      showScanCodeModal.value = false
      CheckRealNameStatus()
    }
  })
}

function CheckRealNameStatus() {
  const rs = get(
    'https://api-v2.locyanfrp.cn/api/v2/realperson/get_status?username=' + store.getters.get_username
  )
  rs.then((res) => {
    // 如果已经完成实名，那么关闭实名的框，展示实人的框
    realName.value = res.data.real_name
    realPersonCount.value = res.data.real_person_count
    realPerson.value = res.data.real_person

    // 实名和实人都完成则展示最终窗口
    if (realName.value === true && realPerson.value == true) {
      showFinishModal.value = true
      showRealnameModal.value = false
      showRealpersonMoal.value = false
      showPayModal.value = false
    }

    // 实名完成但是实人没有完成，展示实人窗口关闭实名窗口
    if (realName.value === true && realPerson.value == false) {
      showFinishModal.value = false
      showRealnameModal.value = false
      // 实人次数足够展示实人，不够展示支付
      console.log(realPersonCount.value);
      if (realPersonCount.value < 1) {
        showRealpersonMoal.value = false
        showPayModal.value = true
      } else {
        showRealpersonMoal.value = true
        showPayModal.value = false
      }
    }

    // 两个都没完成则全部展示
    if (realName.value === false && realPerson.value == false) {
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
    loading.value = false;
  })
}

function realPersonPay() {
  const rs = get("https://api-v2.locyanfrp.cn/api/v2/realperson/pay?username=" + store.getters.get_username + "&notify_url=https://api-v2.locyanfrp.cn/api/v2/realperson/notify&redirect_url=https://dashboard.locyanfrp.cn/realname");
  rs.then((res) => {
    if (res.status === 200) {
      payUrl.value = res.data.url;
    }
  })
  window.open(payUrl.value);
}

CheckRealNameStatus()
</script>
