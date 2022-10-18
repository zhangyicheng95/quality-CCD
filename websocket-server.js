import { WebSocketServer }  from 'ws'
// console.log(ws)
// const WebSocketServer = ws.Server;
let n = 100;
const imageUrl =
  "https://img.zcool.cn/community/01e857577e66620000018c1b418ee4.jpg";

const genData = () => ({
    orderCount: 100,
    exceptionOrderCount: 51,
    imgList: [
        {
            id: `${Math.random()}`.slice(2),
            orderId: `${Math.random()}`.slice(2),
            imageUrl,
            id: n++,
            time: "2021-05-16 23:58:00",
            result: 1,
            isAudited: 0,
            reason: null,
        },
    ],
});
const wss = new WebSocketServer({ port: 58080 });
wss.on("connection", function (ws) {
    console.log("服务端：客户端已连接");
    ws.on("message", function (message) {
    //打印客户端监听的消息
        // console.log(message);
    });
    setInterval(
        () => ws.send(JSON.stringify(genData())),
        5000
    );
});
