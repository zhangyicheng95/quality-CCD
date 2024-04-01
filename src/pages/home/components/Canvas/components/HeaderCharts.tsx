import React, { Fragment } from 'react';
import * as _ from 'lodash';
import icon from '@/assets//images/benchi-logo.svg';
import useClock from '@/hooks/useClock';

interface Props {
  homeSettingData: any;
  started: any;
}

const HeaderCharts: React.FC<Props> = (props: any) => {
  const { homeSettingData, started } = props;
  const { time } = useClock();

  return (
    <Fragment>
      <div
        className="flex-box header-box-left"
        style={{ fontSize: homeSettingData['header']?.fontSize - 8 }}
      >
        <img
          src={icon}
          alt="logo"
          className="header-box-left-logo"
          style={{ width: homeSettingData['header']?.fontSize }}
        />
        <div className="flex-box header-box-left-title">
          {homeSettingData['header']?.headerTitle}
        </div>
        {/* {started ? (
          <div className="flex-box header-box-left-status">
            <div
              className="header-box-left-status-icon"
              style={{
                width: homeSettingData['header']?.fontSize,
                height: homeSettingData['header']?.fontSize,
              }}
            />
            正在运行
          </div>
        ) : null} */}
      </div>
      <div className="header-box-title">{homeSettingData['header']?.headerName}</div>
      <div
        className="flex-box header-box-time"
        style={{ fontSize: homeSettingData['header']?.fontSize - 18 }}
      >
        {started ? (
          <div
            className="flex-box header-box-time-status"
            style={{ fontSize: homeSettingData['header']?.fontSize - 12 }}
          >
            <div
              className="header-box-time-status-icon"
              style={{
                width: homeSettingData['header']?.fontSize,
                height: homeSettingData['header']?.fontSize,
              }}
            />
            在线
          </div>
        ) : null}
        {time}
      </div>
    </Fragment>
  );
};

export default HeaderCharts;
