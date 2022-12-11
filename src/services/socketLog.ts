import { website } from '@/services/consts';

let socket: any = null;
const type = 'log';

const listen = (action: any) => {
  if (!socket) {
    try {
      const ipString: string = localStorage.getItem('ipString') || '';
      const path = `${website.socket}task-${type}/${ipString}?tail=1&n=1`;
      socket = new WebSocket(path);
      socket.onopen = () => console.log(`${type} ws:open`);
      socket.onmessage = (msg: any) => {
        try {
          action({ type: `${type}Message`, payload: msg.data });
        } catch (err) {}
      };
      socket.onclose = function () {
        console.log(`${type} ws:close`);
        socket = undefined;
      };
      socket.onerror = () => reconnect(action);
      action({
        type: `${type}Connect`,
        payload: { [`${type}Status`]: 'success' },
      });
    } catch (e) {
      action({
        type: `${type}Connect`,
        payload: { [`${type}Status`]: 'failed' },
      });
    }
  }
};

let timeConnect = 0;
function reconnect(action: any) {
  timeConnect++;
  console.log(`第${timeConnect}次重连`);
  // 进行重连
  setTimeout(() => {
    listen(action);
  }, 2000);
}

export default listen;
