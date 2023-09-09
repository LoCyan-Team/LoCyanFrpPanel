<template>
    <n-modal>
        <n-card style="width: 600px" title="软件下载" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-space vertical>
                <n-spin :show="show">
                    <div style="text-align: center">
                        文件名: {{ file_name }}
                        <br/>
                        <br/>
                        下载链接: {{ down_link }}
                        <br/>
                        <br/>
                        <n-button type="success" @click="StartDownloading();">点击下载</n-button>
                    </div>
                    <template #description>
                        正在获取下载地址
                    </template>
                </n-spin>
            </n-space>
        </n-card>
    </n-modal>
</template>
<script setup>
import { get } from "../utils/request.js";
import { ref } from "vue";

const show = ref(true);
const file_name = ref("");
const down_link = ref("");

function GetCsApp() {
    const rs = get("https://api.locyanfrp.cn/App/GetCSApp", []);
    rs.then((res) => {
        down_link.value = res.url;
        file_name.value = res.name;
    })
    show.value = false;
}

function StartDownloading(){
    window.open(down_link.value);
}

GetCsApp();
</script>