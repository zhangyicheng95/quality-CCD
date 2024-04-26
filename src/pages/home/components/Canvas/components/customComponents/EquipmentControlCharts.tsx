import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import CustomWindowBody from '@/components/CustomWindowBody';
import stopIcon from '@/assets/imgs/stop.svg';
import startIcon from '@/assets/imgs/start.svg';
import { btnFetch } from '@/services/api';
import { message } from 'antd';
import { connect } from 'umi';
import e from 'express';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const EquipmentControlCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  const {
    dataValue,
    titleFontSize = 24,
    fontSize = 24,
    loading,
    start,
    stop,
    fetchType,
    xName,
  } = data;
  const dom = useRef<any>();
  const [iconSize, setIconSize] = useState(0);
  useEffect(() => {
    setIconSize(
      Math.max(Math.min(dom?.current?.clientHeight, dom?.current?.clientWidth) * 0.4, 50),
    );
  }, [dom?.current?.clientHeight, dom?.current?.clientWidth, fontSize, titleFontSize]);

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.equipmentControlCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="设备控制" loading={loading}>
        <div ref={dom} className="flex-box equipment-btn-box" style={{ fontSize }}>
          <div
            className="flex-box-center equipment-btn-box-item"
            onClick={() => {
              if (started) {
                !!stop && stop?.();
              } else {
                !!start && start?.();
              }
            }}
          >
            <div
              className="equipment-btn-box-item-icon"
              style={{ height: iconSize, width: iconSize }}
            >
              <img src={started ? stopIcon : startIcon} alt="logo" />
            </div>
            <div>{started ? '停止' : '启动'}</div>
          </div>
          <div
            className="flex-box-center equipment-btn-box-item"
            onClick={() => {
              btnFetch(fetchType, xName, { type: 'control', value: 0 }).then((res: any) => {
                if (!!res && res.code === 'SUCCESS') {
                } else {
                  message.error(res?.msg || res?.message || '接口异常');
                }
              });
            }}
          >
            <div
              className="flex-box-center equipment-btn-box-item-icon equipment-btn-box-item-icon-reset"
              style={{ height: iconSize, width: iconSize }}
            >
              Reset
            </div>
            <div style={{ opacity: 0 }}>reset</div>
          </div>
        </div>
      </CustomWindowBody>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(EquipmentControlCharts);