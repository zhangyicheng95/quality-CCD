import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Alert, message } from 'antd';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
}
// 状态组件
const LogCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue,
    fontSize = 12,
    xName,
    logSize = 50
  } = data;
  const socket = useRef<any>();
  const [logList, setLogList] = useState([]);

  useEffect(() => {
    if (!!started) {
      setTimeout(() => {
        const ipString: string = localStorage.getItem('ipString') || '';
        const path = `ws://${xName}/${ipString}`;
        socket.current = new WebSocket(path);
        socket.current.onopen = () => {
          console.log(`ws://${xName}/${ipString}连接成功`);
        };
        socket.current.onmessage = (msg: any) => {
          setLogList((pre: any) => pre?.concat(msg.data));
        };
        socket.current.onclose = function () {
          socket.current = undefined;
        };
      }, 5000);
    };

    return () => {
      socket?.current?.onclose?.();
    }
  }, [started, xName]);

  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.logCharts}`} style={{ fontSize }}>
      {
        (logList || [])?.slice(-logSize)?.map((log: any, index: number) => {
          return <div className="log-charts-item" key={`log-charts-item-${index}`}>
            <div
              className="content-item-span"
              dangerouslySetInnerHTML={{
                // 此处需要处理
                __html: _.isString(log) ? log : log.join('<br />'),
              }}
            />
          </div>
        })
      }
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(LogCharts);
