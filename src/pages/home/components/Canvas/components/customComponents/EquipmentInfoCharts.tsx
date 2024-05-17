import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import plcIcon from '@/assets/benchi/plc.png';
import equipmentIcon from '@/assets/benchi/equipment.png';
import cameraIcon from '@/assets/benchi/camera.png';
import cpuIcon from '@/assets/benchi/cpu.png';
import hexagonIcon from '@/assets/benchi/hexagon.png';
import mechanicalIcon from '@/assets/benchi/mechanical.png';
import timeLengthIcon from '@/assets/benchi/time-length.png';
import useClock from '@/hooks/useClock';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const EquipmentInfoCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, fontSize = 24, xName = 1 } = data;
  dataValue = [
    { name: 'PLC', icon: plcIcon, value: 'CPU 319F-3 PN/DP' },
    { name: '机械臂', icon: equipmentIcon, value: 'UR10(CB31UR10)' },
    { name: '2D相机', icon: cameraIcon, value: 'MV -CH120-10GMGC' },
    { name: 'CPU', icon: cpuIcon, value: 'i7-9700' },
  ];
  const { time } = useClock();

  const timeLength = useMemo(() => {
    const length = new Date(time).getTime() - new Date('2024-04-24 00:00:00').getTime();
    const d = parseInt(length / (24 * 60 * 60 * 1000) + '');
    const h = parseInt((length - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000) + '');
    const m = parseInt((length - h * 60 * 60 * 1000) / (60 * 1000) + '');
    const s = parseInt((length - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000 + '');
    return `${h}小时 ${m}分 ${s}秒`;
  }, [time]);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.equipmentInfoCharts}`}
      style={{ fontSize: fontSize, transform: `scale(${xName})` }}
    >
      <div className="flex-box equipment-info-top">
        <div
          className="flex-box-center equipment-info-top-left"
          style={{ backgroundImage: `url(${timeLengthIcon})` }}
        >
          {' '}
          连续工作时长：{timeLength}
        </div>
        <div
          className="flex-box-center equipment-info-top-right"
          style={{ backgroundImage: `url(${timeLengthIcon})` }}
        >
          近7日停线时长：0小时 0分 0秒
        </div>
      </div>
      <div className="flex-box-center equipment-info-center">
        <div className="equipment-info-center-left">
          <div
            className="flex-box-center equipment-info-center-left-top"
            style={{ backgroundImage: `url(${cameraIcon})` }}
          >
            MV -CH120-10GMGC
          </div>
          <div
            className="flex-box-center equipment-info-center-left-bottom"
            style={{ backgroundImage: `url(${plcIcon})` }}
          >
            CPU 319F-3 PN/DP
          </div>
        </div>
        <div
          className="flex-box-center equipment-info-center-center"
          style={{ backgroundImage: `url(${hexagonIcon})` }}
        >
          <div className="equipment-info-center-center-icon">
            <img src={equipmentIcon} alt="" />
          </div>
          设备信息
        </div>
        <div className="equipment-info-center-right">
          <div
            className="flex-box-center equipment-info-center-right-top"
            style={{ backgroundImage: `url(${mechanicalIcon})` }}
          >
            UR10(CB31UR10)
          </div>
          <div
            className="flex-box-center equipment-info-center-right-bottom"
            style={{ backgroundImage: `url(${cpuIcon})` }}
          >
            i7-9700
          </div>
        </div>
      </div>
      {/* {(dataValue || [])?.map((item: any, index: number) => {
        const { icon, name, value } = item;
        return (
          <div className="flex-box equipment-info-item">
            <div
              className="equipment-info-item-icon"
              style={{ width: Math.max(fontSize, 32), height: Math.max(fontSize, 32) }}
            >
              {!!icon ? <img src={icon} /> : null}
            </div>
            <div className="equipment-info-item-name">{name}: </div>
            {value}
          </div>
        );
      })} */}
    </div>
  );
};

export default EquipmentInfoCharts;
