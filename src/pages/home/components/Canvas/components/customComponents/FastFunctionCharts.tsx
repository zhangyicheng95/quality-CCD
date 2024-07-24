import React, { useEffect, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Badge, Button, message, Modal } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import { btnFetch } from '@/services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SegmentSwitch from '@/components/SegmentSwitch';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const transformName = {
  '_06_PC.Comm_PLCtoPc.bAlarm': '报警停机',
  '_06_PC.Comm_PLCtoPC.bAutoRun': '自动运行中'
}

const FastFunctionCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    titleFontSize = 24, fontSize = 24,
    fetchType, xName, ifNeedAllow = false
  } = data;
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [statusList, setStatusList] = useState<any>({});
  const [loadingList, setLoadingList] = useState({});
  // 初始化参数
  const init = () => {
    btnFetch('get', `${xName}/detector`).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        setSelectedStatus(!!res?.data?._06_PC.Comm_PCtoPLc.bAuto)
        setStatusList(res.data);
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const onChange = (val: any) => {
    setLoadingList((prev) => ({ ...prev, [val]: true }));
    btnFetch(fetchType, `${xName}/writer/${val}/true`).then((res: any) => {
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
              !statusList?.['_06_PC.Comm_PLCtoPc.bAlarm'] ?
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
            style={{ height: fontSize + 18, width: '31%', float: 'left', margin: '0 2% 16px 0' }}
            fontInBody={[
              { value: false, label: '设备手动', backgroundColor: '#b8831b' },
              { value: true, label: '设备自动', backgroundColor: '#88db57' }
            ]}
            value={selectedStatus}
            onChange={(e: any) => {
              const val = e ? '_06_PC.Comm_PCtoPLc.bAuto/true' : '_06_PC.Comm_PCtoPLc.bManual/false';
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
            { title: '设备复位', type: '_06_PC.Comm_PCtoPLc.bReset', color: '' },
            { title: '设备消音', type: '_06_PC.Comm_PCtoPLc.bErase', color: 'warning' },
            { title: '料盒清零', type: '_04_Globle_Variables_Unload.gbUnloadKey.ClearBoxNo', color: 'success' },
            { title: '直流料盒清零', type: '_04_Globle_Variables_Unload.gbUnloadKey.ClearTailCount', color: 'success' },
          ]?.map?.((item: any) => {
            const { title, type, color } = item;
            return (
              <Button
                key={`fast-function-box-btn-${type}`}
                className={color}
                style={{ height: fontSize + 18 }}
                loading={loadingList[type]}
                type={!!color ? 'default' : 'primary'}
                onClick={() => {
                  if (ifNeedAllow) {
                    Modal.confirm({
                      title: '确认此操作？',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: () => {
                        onChange(type);
                      },
                      onCancel: () => {

                      }
                    });
                  } else {
                    onChange(type);
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

export default FastFunctionCharts;
