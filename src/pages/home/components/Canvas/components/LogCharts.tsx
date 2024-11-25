import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Alert, message, Modal } from 'antd';
import { connect } from 'umi';
import { ExpandOutlined } from '@ant-design/icons';

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
    logSize = 50,
    yName = '',
  } = data;
  const socket = useRef<any>();
  const logMsgRef = useRef<any>([]);
  const logRef = useRef<any>(false);
  const [logList, setLogList] = useState<any>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!!started) {
      setTimeout(() => {
        const ipString: string = localStorage.getItem('ipString') || '';
        const path = `ws://${xName}/${ipString}`;
        socket.current = new WebSocket(path);
        socket.current.onopen = () => {
          console.log(`ws://${xName}/${ipString}连接成功`);
          if (!!yName) {
            socket.current?.send?.(yName);
          }
        };
        socket.current.onmessage = (msg: any) => {
          // 先把数据缓存起来
          logMsgRef.current = logMsgRef.current?.concat(msg.data)?.slice?.(-logSize);
          if (!logRef.current) {
            // 鼠标不在窗口范围内，才做渲染
            setLogList(logMsgRef.current);
            setTimeout(() => {
              const bottom: any = document.getElementById('log-bottom');
              bottom.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        };
        socket.current.onclose = function () {
          console.log('服务端主动断开');
          socket?.current?.close?.(1000, '客户端主动断开');
          socket.current = undefined;
        };
      }, 5000);
    };

    return () => {
      socket?.current?.onclose?.();
    }
  }, [started, xName]);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.logCharts}`}
      style={{ fontSize }}
      onMouseOver={() => {
        logRef.current = true;
      }}
      onMouseOut={() => {
        logRef.current = false;
      }}
    >
      <div
        className="content-item-span"
        dangerouslySetInnerHTML={{
          // 此处需要处理
          __html: (logList || [])?.slice?.(-logSize).concat('<div id="log-bottom" />').join('<br /><br />'),
        }}
      />
      <div className="preview-box flex-box-center">
        <ExpandOutlined
          className="preview-icon"
          onClick={() => {
            setVisible(true);
          }}
        />
      </div>
      <Modal
        title={'日志信息'}
        width="calc(100vw - 48px)"
        wrapClassName={'full-screen-modal'}
        centered
        open={visible}
        footer={null}
        onCancel={() => { setVisible(false) }}
      >
        <div className="log-content">
          <div
            className="content-item-span"
            dangerouslySetInnerHTML={{
              // 此处需要处理
              __html: (logList || [])?.slice?.(-logSize).join('<br/><br />'),
            }}
          />
        </div>
      </Modal>
    </div >
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(LogCharts);
