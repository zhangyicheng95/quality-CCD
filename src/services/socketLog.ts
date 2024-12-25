import { website } from '@/services/consts';
import * as _ from 'lodash';

let socket: any = null;
const type = 'log';

const listen = (action: any, logThrottleAndMerge: any) => {
  const handelData = _.throttle((msg: any) => {
    try {
      action({ type: `home/${type}Message`, payload: msg.data });
    } catch (err) { }
  }, 300);

  if (!socket) {
    try {
      const ipString: string = localStorage.getItem('ipString') || '';
      const path = `${website.socket}task-${type}/${ipString}?tail=1&n=1`;
      socket = new WebSocket(path);
      socket.onopen = () => console.log(`${type} ws:open`);
      socket.onmessage = (msg: any) => {
        handelData(msg);
      };
      socket.onclose = function () {
        console.log(`${type} ws:close`);
        socket = undefined;
      };
      socket.onerror = () => reconnect(action, logThrottleAndMerge);
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
function reconnect(action: any, logThrottleAndMerge: any) {
  timeConnect++;
  console.log(`第${timeConnect}次重连`);
  // 进行重连
  setTimeout(() => {
    listen(action, logThrottleAndMerge);
  }, 2000);
}

const close = (action: any) => {
  if (socket) {
    socket.onclose();
  }
};

export default { listen, close };
