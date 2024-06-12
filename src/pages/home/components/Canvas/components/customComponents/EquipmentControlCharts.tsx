import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import CustomWindowBody from '@/components/CustomWindowBody';
import stopIcon from '@/assets/imgs/stop.svg';
import startIcon from '@/assets/imgs/start.svg';
import { btnFetch, startFlowService, stopFlowService } from '@/services/api';
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
  const { dispatch, dataValue, titleFontSize = 24, fontSize = 24 } = data;
  const dom = useRef<any>();
  const [iconSize, setIconSize] = useState(0);
  useEffect(() => {
    setIconSize(
      Math.max(Math.min(dom?.current?.clientHeight, dom?.current?.clientWidth) * 0.4, 50),
    );
  }, [dom?.current?.clientHeight, dom?.current?.clientWidth, fontSize, titleFontSize]);

  const ipString: any = localStorage.getItem('ipString') || '';
  const [loading, setLoading] = useState(false);

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
  // 重启任务
  const reStart = () => {
    if (!ipString) return;
    setLoading(true);
    end()
      .then((res) => {
        if (res) {
          setTimeout(() => {
            start();
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.equipmentControlCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="设备控制" loading={loading} titleFontSize={titleFontSize}>
        <div ref={dom} className="flex-box equipment-btn-box" style={{ fontSize }}>
          <div
            className="flex-box-center equipment-btn-box-item"
            onClick={() => {
              if (started) {
                end();
              } else {
                start();
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
              reStart();
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
