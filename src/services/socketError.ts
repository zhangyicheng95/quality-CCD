import { website } from '@/services/consts';
import _ from 'lodash';

let socket: any = null;
const type = 'error';

const listen = (action: any) => {
  if (!socket) {
    try {
      const ipString: string = localStorage.getItem('ipString') || '';
      const path = `${website.socket}task-${type}/${ipString}`;
      socket = new WebSocket(path);
      socket.onopen = () => {
        console.log(`${type} ws:open`);
      };
      socket.onmessage = (msg: any) => {
        try {
          const result = JSON.parse(msg.data);
          const currentData = {
            time: new Date().getTime(),
            ...result,
            level: _.toLower(result.level),
            message: _.isArray(result?.message) ? result.message.join(',') : result.message,
          };
          // console.log('error ws:', currentData)
          action({
            type: 'setErrorData',
            payload: currentData,
          });
        } catch (err) {
          // console.log(err);
        }
        try {
          // console.log('state message', msg.data);
          const payload = JSON.parse(msg.data);
          action({ type: `home/${type}Message`, payload });
        } catch (err) { }
      };
      socket.onclose = function () {
        console.log(`${type} ws:close`);
        socket = undefined;
      };
      socket.onerror = () => reconnect(action);
      action({
        type: `home/${type}Connect`,
        payload: { [`${type}Status`]: 'success' },
      });
    } catch (e) {
      action({
        type: `home/${type}Connect`,
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

const close = (action: any) => {
  if (socket) {
    socket.onclose();
  }
};

export default { listen, close };
