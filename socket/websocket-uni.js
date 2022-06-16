let socketOpen = false;
let socketMsgQueue = [];
let aState // 连接状态
let bState
  import {
    BASE_URL
  } from '../request/baseUrl.js'
  import UserLogin from '../common/userlogin.js'
export default {
    client: null,
    // baseURL: 'ws://***********',
    // baseURL: 'wss://192.168.2.10:8199/api/v2/registry-app',
    // baseURL: 'http://192.168.2.10:8199/api/v2/registry-app',
    // baseURL: 'http://192.168.2.101:8199/api/v2/registry-app',
    baseURL: BASE_URL + '/api/v2/registry-app',
    header:{
      Authorization: 'Bearer ' + UserLogin.getToken()
    },
    init() {
        if (this.client) {
            return Promise.resolve(this.client);
        }

        return new Promise((resolve, reject) => {
            const ws = {
                send: this.sendMessage,
                onopen: null,
                onmessage: null,
                close: this.closeSocket,
            };
            uni.connectSocket({
                url: this.baseURL,
                header: this.header,
            });

            uni.onSocketOpen(function(res) {
                console.log('WebSocket连接已打开！', res);
                aState = 'WebSocket连接已打开'
                bState = res
                console.log(JSON.stringify(res));
                socketOpen = true;
                for (let i = 0; i < socketMsgQueue.length; i++) {
                    ws.send(socketMsgQueue[i]);
                }
                socketMsgQueue = [];
                ws.onopen && ws.onopen();
            });

            uni.onSocketMessage(function(res) {
              console.log(res, '连接信息');
                ws.onmessage && ws.onmessage(res);
            });

            uni.onSocketError(function(res) {
                console.log('WebSocket 错误！', res);
            });

            uni.onSocketClose((res) => {
                this.client.disconnect();
                this.client = null;
                socketOpen = false;
                console.log('WebSocket 已关闭！', res);
                aState = 'WebSocket连接已关闭'
                bState = res
            });

            const Stomp = require('./stomp.js').Stomp;
            Stomp.setInterval = function(interval, f) {
                return setInterval(f, interval);
            };
            Stomp.clearInterval = function(id) {
                return clearInterval(id);
            };

            const client = this.client = Stomp.over(ws);
            client.connect(this.header, function() {
                console.log('stomp connected');
                resolve(client);
            }, e => {
              console.log(e, '连接错误报错提示');
            });
        });
    },
    disconnect() {
        uni.closeSocket();
    },
    sendMessage(message) {
        if (socketOpen) {
            uni.sendSocketMessage({
                data: message,
            });
        } else {
            socketMsgQueue.push(message);
        }
    },
    closeSocket() {
        console.log('closeSocket');
    },
    outputMes() {
      return {aState,bState}
    }
};

