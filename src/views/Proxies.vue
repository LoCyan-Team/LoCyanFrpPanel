<template>
  <downloadSoftPage v-model:show="showDownloadPage"></downloadSoftPage>
  <!-- 编辑隧道的模态框 -->
  <n-modal v-model:show="showEditModal" class="custom-card" preset="card" :style="bodyStyle"
    :title="'编辑隧道 - 隧道ID: ' + String(SelectProxyID)" size="huge" :bordered="false" :segmented="segmented"
    :mask-closable="false">
    <template #header-extra> 点此关闭 -></template>
    <n-form :ref="formRef" :model="ProxyEditInfo" :rules="rules" label-width="auto" size="large">
      <n-grid cols="2" item-responsive>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="选择服务器" path="node">
            <n-select v-model:value="ProxyEditInfo.node" :options="EditServerList" />
          </n-form-item>
          <template v-if="!ServerList[ProxyEditInfo.node]">
            <n-alert title="该隧道节点已下线" type="error"></n-alert>
            <br />
          </template>
          <n-form-item label="隧道名" path="proxy_name">
            <n-input v-model:value="ProxyEditInfo.proxy_name" placeholder="隧道名" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="穿透协议" path="proxy_type">
            <n-radio-group v-model:value="ProxyEditInfo.proxy_type" @update:value="ProxyTypeSelectChangeHandle">
              <n-radio-button value="1"> TCP</n-radio-button>
              <n-radio-button value="2"> UDP</n-radio-button>
              <n-radio-button value="3"> HTTP</n-radio-button>
              <n-radio-button value="4"> HTTPS</n-radio-button>
              <n-radio-button value="5"> XTCP</n-radio-button>
              <n-radio-button value="6"> STCP</n-radio-button>
            </n-radio-group>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网IP" path="local_ip">
            <n-input v-model:value="ProxyEditInfo.local_ip" placeholder="内网IP，例如127.0.0.1" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="内网端口" path="local_port">
            <n-input v-model:value="ProxyEditInfo.local_port"
              placeholder="内网端口, HTTP:80 HTTPS:443 MC:25565/19136 泰拉瑞亚:7777" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="远程端口" path="remote_port">
            <n-input v-model:value="ProxyEditInfo.remote_port" placeholder="映射到远程服务器上的端口" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="0:2 1000:1">
          <n-form-item label="自定义域名" path="domain" v-show="ShowDomainInput">
            <n-input v-model:value="ProxyEditInfo.domain" placeholder="HTTPS/HTTP需要填写，其他协议不需要填写" />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button style="margin: 2px" strong secondary type="primary" @click="EditProxy(Proxies[indexOfProxies].id)">提交
      </n-button>
    </template>
  </n-modal>
  <!--查看详细信息的模态框 -->
  <n-modal v-model:show="showDetailModal" class="custom-card" preset="card" :style="bodyStyle"
    :title="'详细信息 - 隧道ID: ' + SelectProxyID" size="huge" :bordered="false" :segmented="segmented">
    <template #header-extra> 点此关闭 -></template>
    <p>连接地址：{{ LinkAddr }}</p>
    <p>服务器ID：{{ ServerList[Proxies[indexOfProxies].node].id }}</p>
    <p>服务器：{{ ServerList[Proxies[indexOfProxies].node].name }}</p>
    <p>服务器IP：{{ ServerList[Proxies[indexOfProxies].node].ip }}</p>
    <p>服务器域名：{{ ServerList[Proxies[indexOfProxies].node].hostname }}</p>
    <p>本地地址：{{ Proxies[indexOfProxies].local_ip }}</p>
    <p>穿透协议：{{ Proxies[indexOfProxies].proxy_type }}</p>
    <p>本地端口：{{ Proxies[indexOfProxies].local_port }}</p>
    <p>远程端口：{{ Proxies[indexOfProxies].remote_port }}</p>
    <p>
      绑定域名：{{ Proxies[indexOfProxies].domain || "该隧道没有绑定域名" }}
    </p>
    <p>
      简易启动命令：./frpc.exe -u {{ store.getters.get_frp_token }} -p {{ SelectProxyID }}
    </p>
    <!-- <template #footer>
            </template> -->
  </n-modal>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-books"></i>
    <n-text type="primary"> 隧道列表</n-text>
  </n-h1>
  <n-spin :show="show">
    <n-grid cols="4" item-responsive>
      <n-gi v-for="item in Proxies" style="margin: 10px" span="0:4 950:1" :id="Proxies.indexOf(item)">
        <n-space style="display: block">
          <n-card :title="'ID: ' + item.id + ' - ' + item.proxy_name">
            <n-tag :bordered="false" type="success">
              {{ item.proxy_type }}
            </n-tag>
            <n-tag :bordered="false" type="info" v-if="ServerList[item.node]">
              {{ ServerList[item.node].name || "未知节点" }}
            </n-tag>
            <n-tag :bordered="false" type="error" v-else> 未知节点</n-tag>
            <template #footer>
              <div v-if="ServerList[item.node]">
                连接地址： <br />
                {{ makelinkaddr(Proxies.indexOf(item)) }}
              </div>
              <div v-else>
                连接地址： <br />
                节点已下线
              </div>
            </template>
            <template #action>
              <n-space>
                <p style="margin-top: 9px">操作：</p>
                <!-- index: 在点击编辑按钮时，将当前隧道对应的数组索引传递到变量中以便调用 -->
                <n-button style="margin: 1px" strong secondary type="primary" @click="
                  indexOfProxies = Proxies.indexOf(item);
                showEditModal = true;
                SelectProxyID = item.id;
                ProxyEditInfo = {
                  node: item.node,
                  id: SelectProxyID,
                  proxy_name: item.proxy_name,
                  proxy_type: transtype(item.proxy_type),
                  local_ip: item.local_ip,
                  local_port: item.local_port.toString(),
                  remote_port: item.remote_port,
                  domain: item.domain,
                };
                ShowDomainInput =
                  item.proxy_type === 'http' || item.proxy_type === 'https';
                ">编辑
                </n-button>
                <n-button style="margin: 1px" strong secondary type="error" @click="deleteProxy(Proxies.indexOf(item))">删除
                </n-button>
                <!-- 这个click被我利用到极致了 -->
                <n-button style="margin: 1px" strong secondary type="info" @click="
                  indexOfProxies = Proxies.indexOf(item);
                LinkAddr = makelinkaddr(Proxies.indexOf(item));
                showDetailModal = true;
                SelectProxyID = item.id;
                ">详细信息
                </n-button>
                <n-button style="margin: 1px" strong secondary type="warning"
                  @click="LaunchProxyThroughApplication(item.id)">一键启动
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </n-spin>
</template>

<script setup>
import { ref } from "vue";
import { useDialog } from "naive-ui";
import store from "../utils/stores/store.js";
import downloadSoftPage from "../components/InstallCsApp.vue";
import { get } from "../utils/request.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/message";
import { SendErrorDialog, SendSuccessDialog, SendWarningDialog, } from "../utils/dialog.js";

const show = ref(true);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const SelectProxyID = ref(0);
const indexOfProxies = ref(0);
const dialog = useDialog();
const LinkAddr = ref("");
const EditServerList = ref([]);
const bodyStyle = {
  width: "600px",
};
const segmented = {
  content: "soft",
  footer: "soft",
};
const EditCheck = ref(true);
const showDownloadPage = ref(false);

// 隧道类型翻译
function transtype(type) {
  let pt;
  if (type === "tcp") {
    pt = "1";
  } else if (type === "udp") {
    pt = "2";
  } else if (type === "http") {
    pt = "3";
  } else if (type === "https") {
    pt = "4";
  } else if (type === "xtcp") {
    pt = "5";
  } else if (type === "stcp") {
    pt = "6";
  } else {
    pt = "1";
  }
  return pt;
}

// 就是有弱智不知道隧道链接是什么，气死我了
function makelinkaddr(id) {
  if (
    Proxies.value[id].proxy_type === "http" ||
    Proxies.value[id].proxy_type === "https"
  ) {
    return Proxies.value[id].domain.substring(2, Proxies.value[id].domain.length-2);
  } else {
    return (
      ServerList.value[Proxies.value[id].node].hostname +
      ":" +
      Proxies.value[id].remote_port
    );
  }
}

function LaunchProxyThroughApplication(id) {
  dialog.success({
    title: "通知",
    content: "该功能需要配合 C# 客户端使用! \n 使用过程中千万不要直接关掉窗口, 请按组合键 Ctrl + C",
    positiveText: "已经安装好了",
    negativeText: "没安装...",
    onPositiveClick: () => {
      const url = "locyanfrp://" + store.getters.get_frp_token + "/" + id;
      window.open(url);
    },
    onNegativeClick: () => {
      showDownloadPage.value = true;
    },
    onMaskClick: () => {
      sendSuccessMessage("你取消了操作！");
    },
  });
}

function EditProxy(proxyid) {
  if (EditCheck.value === false) {
    SendWarningDialog("参数检查未通过，请检查信息格式是否正确！");
  }
  const rs = get(
    "https://api.locyanfrp.cn/Proxies/update?username=" +
    store.getters.get_username +
    "&name=" +
    ProxyEditInfo.value.proxy_name +
    "&key=" +
    store.getters.get_frp_token +
    "&ip=" +
    ProxyEditInfo.value.local_ip +
    "&type=" +
    ProxyEditInfo.value.proxy_type +
    "&lp=" +
    ProxyEditInfo.value.local_port +
    "&rp=" +
    ProxyEditInfo.value.remote_port +
    "&ue=0&uz=0&id=" +
    ProxyEditInfo.value.node +
    "&token=" +
    store.getters.get_token +
    "&url=" +
    ProxyEditInfo.value.domain +
    "&proxyid=" +
    proxyid,
    []
  );
  rs.then((res) => {
    if (res.status === true) {
      // 重新刷新列表
      initList();
      // 关闭模态框
      showEditModal.value = false;
      SendSuccessDialog(res.message);
    } else {
      SendErrorDialog(res.message);
    }
  });
}

const rules = {
  proxy_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        EditCheck.value = false;
        return new Error("请输入隧道名");
      } else if (!/[A-Za-z0-9_]$/.test(value)) {
        EditCheck.value = false;
        return new Error("隧道名格式错误，由字母、数字和下划线组成！");
      }
      EditCheck.value = true;
      return true;
    },
  },
  proxy_type: {
    required: true,
  },
  local_ip: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        EditCheck.value = false;
        return new Error("请输入本地 IP");
      } else if (
        !/(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))/.test(
          value
        )
      ) {
        EditCheck.value = false;
        return new Error("本地 IP 格式不合法！");
      }
      EditCheck.value = true;
      return true;
    },
  },
  local_port: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        EditCheck.value = false;
        return new Error("请输入本地端口！");
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        EditCheck.value = false;
        return new Error("本地端口格式不合法！");
      }
      EditCheck.value = true;
      return true;
    },
  },
  remote_port: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule, value) {
      if (!value) {
        EditCheck.value = false;
        return new Error("请输入远程端口！");
      } else if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          value
        )
      ) {
        EditCheck.value = false;
        return new Error("远程端口格式不合法！");
      }
      EditCheck.value = true;
      return true;
    },
  },
  domain: {
    required: false,
    validator(rule, value) {
      if (!value) {
        EditCheck.value = false;
        return new Error("请输入域名！");
      } else if (
        !/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$/.test(value)
      ) {
        EditCheck.value = false;
        return new Error("域名格式不合法！");
      }
      EditCheck.value = true;
      return true;
    },
  },
};

const ShowDomainInput = ref(false);

function ProxyTypeSelectChangeHandle(value) {
  ShowDomainInput.value = value === "3" || value === "4";
}

const Proxies = ref([]);
const ServerList = ref([
  {
    id: 0,
    name: "",
    description: "",
    ip: "",
    hostname: "",
    status: "",
  },
]);

function initList() {
  const rs2 = get("https://api-v2.locyanfrp.cn/api/v2/nodes/list", []);
  rs2.then((res) => {
    let i = 0;
    res.forEach((s) => {
      EditServerList.value[i] = {
        label: s.name,
        value: s.id,
      };

      ServerList.value[s.id] = s;
      i = i + 1;
    });
  });

  const rs = get(
    "https://api-v2.locyanfrp.cn/api/v2/proxies/getlist?username=" + localStorage.getItem("username"));
  rs.then((res) => {
    if (res.status !== 200) {
      return res;
    } else {
      Proxies.value = res.data.proxies;
      show.value = false;
    }
  });
}

initList();

// 表格数据
const formRef = ref(null);
// 表单数据集合
const ProxyEditInfo = ref({
  node: 0,
  id: 0,
  proxy_name: "",
  proxy_type: "1",
  local_ip: "",
  local_port: "",
  remote_port: "",
  domain: "",
});

function deleteProxy(id) {
  dialog.warning({
    title: "警告",
    content: "你确定要删除这个隧道吗？（隧道 ID：" + Proxies.value[id].id + "）",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      const rs = get(
        "https://api.locyanfrp.cn/Proxies/remove?proxyid=" +
        Proxies.value[id].id +
        "&username=" +
        store.getters.get_username +
        "&token=" +
        store.getters.get_token,
        []
      );
      rs.then((res) => {
        if (res.status) {
          sendSuccessMessage(res.message);
          Proxies.value.splice(id, 1);
        } else {
          sendErrorMessage(res.message);
        }
      });
    },
    onNegativeClick: () => {
      sendSuccessMessage("你取消了操作！");
    },
    onMaskClick: () => {
      sendSuccessMessage("你取消了操作！");
    },
  });
}
</script>
