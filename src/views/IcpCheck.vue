<template>
    <n-h1 prefix="bar" style="margin-top: 30px">
        <i class="twa twa-page-facing-up"></i>
        <n-text type="primary"> 域名白名单</n-text>
    </n-h1>

    <n-alert title="说明" type="info">
      1. 使用国内节点建站需要使用备案域名，我站为了防止非备案域名非法解析国内节点造成损失，现启用域名白名单；<br/>
      2. 域名需在中华人民共和国工业和信息化部完成并通过备案，随后将顶级域名填入下方编辑框中提交即可。
    </n-alert>
    <br/>

    <n-form :ref="formRef" :model="domainInput" label-width="auto" size="large">
        <n-grid y-gap="12" cols="1" item-responsive>
            <n-grid-item span="1">
                <n-form-item label="域名" path="domain">
                    <n-input v-model:value="domainInput.domain" placeholder="example.com" />
                </n-form-item>
                <div style="display: flex; justify-content: flex-start">
                    <n-button type="primary" @click="submit"> 创建</n-button>
                </div>
            </n-grid-item>
            <n-grid-item span="1">
                <n-list bordered v-show="showList">
                    <template #header>
                        已登记的域名
                    </template>
                    <n-list-item v-for="item in IcpList">
                        <n-thing :title="item.domain"
                            :description="item.unitName + ' (' + item.natureName + ') - ' + item.icp">
                        </n-thing>
                        <template #suffix>
                            <n-button type="error" @click="RemoveIcp(item.id)">删除</n-button>
                        </template>
                    </n-list-item>
                </n-list>
            </n-grid-item>
        </n-grid>
    </n-form>
</template>
<script setup>
import { ref } from "vue";
import store from "../utils/stores/store.js";
import { get, Delete } from "../utils/request.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/message";
import { SendErrorDialog, SendSuccessDialog } from "../utils/dialog.js";
import { useDialog } from "naive-ui";

const showList = ref(false);
const formRef = ref(null);
const dialog = useDialog();
const loading = ref(false);
const domainInput = ref({
    domain: ""
});
const IcpList = ref([{
    id: 0,
    icp: "",
    unitName: "",
    natureName: "",
    status: "",
    domain: "",
    username: ""
}])

function submit() {
    if (loading.value == true) {
        return;
    }
    loading.value = true;
    if (domainInput.value.domain === "" || domainInput.value.domain === null) {
        SendErrorDialog("域名不得为空！");
        loading.value = false;
        return;
    }
    const rs = get("https://api-v2.locyanfrp.cn/api/v2/icp/check?domain=" + domainInput.value.domain + "&token=" + store.getters.get_token + "&username=" + store.getters.get_username);
    rs.finally((res) => {
        loading.value = false;
    });
    rs.then((res) => {
        if (res.status != 200) {
            loading.value = false;
            SendErrorDialog("审核失败，可能是域名没有备案或格式错误！");
        } else {
            GetList();
            loading.value = false;
            SendSuccessDialog("添加成功！");
        }
    })

}

function RemoveIcp(id) {
    dialog.warning({
        title: "警告",
        content: "你确定要删除这个域名吗？（域名 ID: " + id + "）",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: () => {
            const rs = Delete("https://api-v2.locyanfrp.cn/api/v2/icp/remove?id=" + id + "&token=" + store.getters.get_token + "&username=" + store.getters.get_username);
            rs.then((res) => {
                if (res.status === 200) {
                    SendSuccessDialog("删除成功！");
                    GetList();
                } else {
                    SendErrorDialog("删除失败，请联系管理员处理！");
                }
            })
        },
        onNegativeClick: () => {
            sendSuccessMessage("你取消了操作！");
        },
        onMaskClick: () => {
            sendSuccessMessage("你取消了操作！");
        },
    });
}

function GetList() {
    const rs = get("https://api-v2.locyanfrp.cn/api/v2/icp/list?token=" + store.getters.get_token + "&username=" + store.getters.get_username);
    rs.then((res) => {
        if (res.status === 200) {
            IcpList.value = res.data.list;
            showList.value = true;
        } else {
            showList.value = false;
        }
    })
}

GetList();
</script>
