import websocket from "../utils/stores/websocket";
import store from "../utils/stores/store";

// 在当前js全局化
let ws;
export function init_ws(){
    if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        ws = new WebSocket(``);
        ws.onopen = function() {console.log('webSocket connect successful');websocket.commit("set_ws_token", ws);ws.send("token:" + store.getters.GetFrpToken)};
        ws.onclose = function() {
            // 关闭 websocket
            console.log("webSocket connect closed");
            setTimeout(() => {
                init_ws();
            }, 2000);
        };
    } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
    }
}

export function SetOnMessageFunction(handle_function){
    console.log("成功设置回调函数");
    ws.onmessage = handle_function;
}