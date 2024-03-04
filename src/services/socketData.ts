import { website } from '@/services/consts';
import { guid } from '@/utils/utils';
import _ from 'lodash';

let socket: any = null;
const type = 'data';

const listen = (action: any) => {
  if (!socket) {
    try {
      const ipString: string = localStorage.getItem('ipString') || '';
      const path = `${website.socket}task-${type}/${ipString}`;
      socket = new WebSocket(path);
      socket.onopen = () => {
        console.log(`${type} ws:open`);
        action({
          type: 'home/set',
          payload: {
            taskDataConnect: true,
          },
        });
      };
      socket.onmessage = (msg: any) => {
        try {
          const result = JSON.parse(msg.data);
          const { uid = '', data = {}, ...rest } = result;
          if (uid) {
            const newData = (Object.entries(data || {}) || []).reduce((pre: any, cen: any) => {
              const key = cen[0]?.split('@')[0],
                value = _.isBoolean(cen[1])
                  ? cen[1]
                    ? 'RUNNING'
                    : 'STOPPED'
                  : !!cen[1]?.name?.indexOf('.ply') || !!cen[1]?.name?.indexOf('.stl')
                  ? { ...cen[1], guid: guid() }
                  : cen[1];

              if (key == 'uid') {
                return {
                  uid,
                  ...pre,
                };
              }
              return {
                uid,
                ...pre,
                [_.toLower(key)]: value,
                [key]: value,
              };
            }, {});
            action({ type: `home/${type}Message`, payload: newData });
          }
        } catch (err) {}
      };
      socket.onclose = function () {
        console.log(`${type} ws:close`);
        action({
          type: 'home/set',
          payload: {
            taskDataConnect: false,
          },
        });
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
