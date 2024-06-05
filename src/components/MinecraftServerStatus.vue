<template>
    <span>状态：{{ MCStatusList.online ? '在线' : '离线' }}</span>
    <br />
    <span>游戏版本：{{ MCStatusList.protocol.name ?? '未知' }}</span>
    <br />
    <span>游戏协议版本：{{ MCStatusList.protocol.version ?? '未知' }}</span>
    <br />
    <span>服务端版本：{{ MCStatusList.version ?? '未知' }}</span>
    <br />
    <span>
        MOTD：
        <span v-for='line in MCStatusList.motd.html' v-html=line></span>
    </span>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { get } from "../utils/request";

export default defineComponent({
    name: 'MinecraftServerStatus',
    props: [
        'address',
        'bedrock',
    ],
    setup(props, context) {
        getMinecraftGameStatus(props.address, props.bedrock)
        return {
            MCStatusList: ref({
                online: false,
                version: null,
                motd: {
                    html: [],
                },
                protocol: {
                    version: -1,
                    name: null
                }
            })
        }
    }
})

function getMinecraftGameStatus(addr, bedrock = false) {
    const rs = get(`https://api.mcsrvstat.us${bedrock ? '/bedrock' : ''}/3/${addr}`);
    rs.then((res) => {
        if (res.status === 200) {
            MCStatusList = {
                online: res.data.online,
                version: res.data.version ?? '',
                motd: {
                    html: res.data.motd ?? [],
                },
                protocol: {
                    version: res.data.protocol.version ?? -1,
                    name: res.data.protocol.name ?? '',
                }
            }
        }
    })
}
</script>