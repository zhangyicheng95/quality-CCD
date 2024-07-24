import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message, Modal } from 'antd';
import { btnFetch, startFlowService, stopFlowService } from '@/services/api';
import SegmentSwitch from '@/components/SegmentSwitch';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const SegmentSwitchCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started, dispatch } = props;
  const {
    dataValue,
    fontSize = 14,
    yName = '',
    des_layout,
    des_bordered,
    timeSelectDefault = [],
    xName,
    fetchType,
    ifNeedAllow = false,
  } = data;
  const ipString: any = localStorage.getItem('ipString') || '';
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (started) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setSelected(res?.data?.value);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
          const select = dataValue || timeSelectDefault?.[0]?.value;
          setSelected(select);
        }
      });
    }
  }, [timeSelectDefault, started]);
  // 启动任务
  const start = () => {
    if (!ipString) {
      return;
    } else {
      setLoading(true);
      startFlowService(ipString || '', '').then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('任务启动成功');
          dispatch({
            type: 'home/set',
            payload: {
              started: true,
            },
          });
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
        setLoading(false);
      });
    }
  };
  // 停止任务
  const end = () => {
    return new Promise((resolve: any, reject: any) => {
      if (!ipString) {
        reject(false);
      } else {
        setLoading(true);
        stopFlowService(ipString || '').then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('任务停止成功');
            dispatch({
              type: 'home/set',
              payload: {
                started: false,
              },
            });
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
          setLoading(false);
          resolve(true);
        });
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.segmentSwitchCharts}`}
      style={{ fontSize }}
    >
      <SegmentSwitch
        title={yName}
        layout={des_layout}
        border={des_bordered}
        fontInBody={timeSelectDefault}
        value={selected}
        disabled={loading}
        onChange={(e: any) => {
          if (e === 'start') {
            start();
          } else if (e === 'stop') {
            end();
          } else {
            const func = () => {
              setSelected(e);
              if (!fetchType || !xName) return;
              btnFetch(fetchType, xName, { value: e }).then((res: any) => {
                if (!!res && res.code === 'SUCCESS') {
                  message.success('success');
                } else {
                  message.error(res?.message || '后台服务异常，请重启服务');
                  setSelected(selected);
                }
              });
            };
            if (ifNeedAllow) {
              Modal.confirm({
                title: '确认此操作？',
                icon: <ExclamationCircleOutlined />,
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  func();
                },
                onCancel: () => {
                  setSelected(e);
                  setTimeout(() => {
                    setSelected(selected);
                  }, 200);
                }
              });
            } else {
              func();
            }
          }
        }}
      />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(SegmentSwitchCharts);
