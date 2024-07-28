import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Badge, Button, message, Modal } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import { btnFetch } from '@/services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SegmentSwitch from '@/components/SegmentSwitch';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const transformName1 = {
  '_06_PC.Comm_PLCtoPc.bAlarm': '报警停机',
  '_06_PC.Comm_PLCtoPC.bAutoRun': '自动运行中'
};
const transformName2 = {
  '_10_Global_Variables_Alarm.Alm_ActiveAlarmNum': '当前激活的报警数量',  //int
  '_10_Global_Variables_Alarm.AlarmActiveArray[1..20].EventMessage': '', //WSTRING
  '_10_Global_Variables_Alarm.AlarmActiveArray[1..20].Eventld': '',  //int
  '_10_Global_Variables_Alarm.AlarmActiveArray[1..20].EventTime': '',  //DT
}

const FastFunctionCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  const {
    titleFontSize = 24, fontSize = 24,
    fetchType, xName, ifNeedAllow = false, httpRotation, httpRotationTime
  } = data;
  const timeRef = useRef<any>();
  const socketRef = useRef<any>();
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [statusList, setStatusList] = useState<any>({});
  const [loadingList, setLoadingList] = useState({});
  // 初始化参数
  const init = () => {
    btnFetch('get', `${xName}/detector/`).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        setSelectedStatus(!!res?.data?.['_06_PC.Comm_PCtoPLC.bAuto'])
        setStatusList(res.data);
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
            setSelectedStatus(!!res?.['_06_PC.Comm_PCtoPLC.bAuto'])
            setStatusList(res);
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
    }
  }, []);

  const onChange = (val: any, bool: Boolean) => {
    setLoadingList((prev) => ({ ...prev, [val]: true }));
    btnFetch(fetchType, `${xName}/writer/${val}/${bool}`).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        message.success('操作成功!');
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
      setLoadingList((prev) => ({ ...prev, [val]: false }))
    });
  };
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.fastFunctionCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="便捷功能" style={{ fontSize }} titleFontSize={titleFontSize}>
        <div className="fast-function-box">
          <div className='flex-box' style={{
            width: '100%',
            fontSize: (fontSize + 10) > 48 ? 48 : (fontSize + 10)
          }}>
            {
              !!statusList?.['_06_PC.Comm_PLCtoPc.bAlarm'] ?
                <div className="flex-box-center error-font" style={{
                  width: '100%',
                  gap: 8,
                  marginBottom: 8
                }}>
                  <Badge status="processing" />
                  <div>停机报警</div>
                </div>
                : null
            }
          </div>
          <SegmentSwitch
            style={{ height: fontSize + 18, width: '64%', float: 'left', margin: '0 2% 16px 0' }}
            fontInBody={[
              { value: false, label: '设备手动', backgroundColor: 'rgba(24, 144, 255, 1)' },
              { value: true, label: '设备自动', backgroundColor: '#88db57' }
            ]}
            value={selectedStatus}
            onChange={(e: any) => {
              const val = e ? '_06_PC.Comm_PCtoPLC.bAuto/true' : '_06_PC.Comm_PCtoPLC.bManual/true';
              const func = () => {
                setSelectedStatus(prev => !prev);
                btnFetch(fetchType, `${xName}/writer`, val).then((res: any) => {
                  if (!!res && res.code === 'SUCCESS') {
                  } else {
                    message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
                    setTimeout(() => {
                      setSelectedStatus(selectedStatus);
                    }, 200);
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

                  }
                });
              } else {
                func();
              }
            }}
          />
          {[
            { title: '设备复位', type: '_06_PC.Comm_PCtoPLC.bReset', color: '' },
            { title: '设备启动', type: '_06_PC.Comm_PCtoPLC.bStart', color: 'success' },
            { title: '设备停止', type: '_06_PC.Comm_PCtoPLC.bStop', color: 'error' },
            { title: '设备消音', type: '_06_PC.Comm_PCtoPLC.bErase', color: 'warning' },
            { title: '料盒清零', type: '_04_Globle_Variables_Unload.gbUnloadKey.ClearBoxNo', color: '' },
            { title: '直流料盒清零', type: '_04_Globle_Variables_Unload.gbUnloadKey.ClearTailCount', color: '' },
          ]?.map?.((item: any) => {
            const { title, type, color } = item;
            return (
              <Button
                key={`fast-function-box-btn-${type}`}
                className={color}
                style={{ height: fontSize + 18 }}
                loading={loadingList[type]}
                type={!!color ? 'default' : 'primary'}
                onMouseDown={() => {
                  if (!ifNeedAllow) {
                    onChange(type, true);
                  }
                }}
                onMouseUp={() => {
                  if (!ifNeedAllow) {
                    onChange(type, false);
                  }
                }}
                onClick={() => {
                  if (ifNeedAllow) {
                    Modal.confirm({
                      title: '确认此操作？',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: () => {
                        onChange(type, true);
                      },
                      onCancel: () => {

                      }
                    });
                  } else {
                  }
                }}
              >
                {title}
              </Button>
            );
          })}
        </div>

      </CustomWindowBody>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(FastFunctionCharts);
