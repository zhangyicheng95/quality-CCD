import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message } from 'antd';
import { btnFetch } from '@/services/api';
import BasicTable from '@/components/BasicTable';
import { connect } from 'umi';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const AntdTableFromHttpCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  const {
    fontSize = 24, fetchType, xName, httpRotation, httpRotationTime
  } = data;
  const timeRef = useRef<any>();
  const socketRef = useRef<any>();
  const [errorList, setErrorList] = useState<any>([]);
  const init = () => {
    // 告警信息
    btnFetch('get', `${xName}/warning/`).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        const { alarm_num, event_time, event_id, event_message } = res.data;
        let result = [];
        for (let i = 0; i < alarm_num; i++) {
          result.push({
            event_time: event_time[i] || '-',
            event_id: event_id[i] || '-',
            event_message: event_message[i] || '-'
          })
        }
        setErrorList(result);
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
      if (!!httpRotation) {
        !!timeRef.current && clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => {
          init();
        }, httpRotationTime || 2000);
      }
    });
  };

  useEffect(() => {
    if (!!xName && !!started) {
      if (fetchType === 'wbsocket') {
        socketRef.current = new WebSocket(xName?.indexOf('ws://') > -1 ? xName : `ws://${xName}`);
        socketRef.current.onmessage = (msg: any) => {
          try {
            let res: any = {};
            if (_.isString(msg.data)) {
              res = JSON.parse(msg.data);
            } else {
              res = msg.data;
            }
            const { alarm_num, event_time, event_id, event_message } = res;
            let result = [];
            for (let i = 0; i < alarm_num; i++) {
              result.push({
                event_time: event_time[i] || '-',
                event_id: event_id[i] || '-',
                event_message: event_message[i] || '-'
              })
            }
            setErrorList(result);
          } catch (err) {
            // console.log(err);
          }
        };
        socketRef.current.onclose = function () {
          socketRef.current = undefined;
        };
      } else {
        init();
      }
    }

    return () => {
      !!timeRef.current && clearTimeout(timeRef.current);
      !!socketRef.current && socketRef.current?.onclose?.();
    }
  }, []);
  const columns = [
    {
      title: '告警时间',
      dataIndex: 'event_time',
      key: 'event_time',
    },
    {
      title: '告警编码',
      dataIndex: 'event_id',
      key: 'event_id',
    },
    {
      title: '描述信息',
      dataIndex: 'event_message',
      key: 'event_message',
    }
  ];
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.antdTableFromHttpCharts}`}
      style={{ fontSize }}
    >
      <div className="http-table-box">
        <BasicTable
          columns={columns}
          dataSource={errorList}
          bordered
          size="small"
          pagination={null}
          rowKey={(record: any) => record.event_id || guid()}
        />
      </div>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(AntdTableFromHttpCharts);
