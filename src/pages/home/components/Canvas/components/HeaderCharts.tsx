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

  if (!homeSettingData['header']?.fontSize) {
    if (!homeSettingData['header']) {
      homeSettingData['header'] = {};
      homeSettingData['header']['fontSize'] = 20;
    } else {
      homeSettingData['header']['fontSize'] = 20;
    }
  }
  if (!homeSettingData['header']?.headerTitleFontSize) {
    homeSettingData['header']['headerTitleFontSize'] = 24;
  }

  return (
    <Fragment>
      <div
        className="flex-box header-box-left"
        style={{
          fontSize: homeSettingData['header']?.headerTitleFontSize,
          alignItems: homeSettingData['header']?.titleAlign,
        }}
      >
        {!!homeSettingData['header']?.headerTitle ? (
          <img
            src={icon}
            alt="logo"
            className="header-box-left-logo"
            style={{
              width: homeSettingData['header']?.headerTitleFontSize,
              height: homeSettingData['header']?.headerTitleFontSize,
            }}
          />
        ) : null}
        <div
          className="flex-box header-box-left-title"
          style={{ height: homeSettingData['header']?.headerTitleFontSize }}
        >
          {homeSettingData['header']?.headerTitle}
        </div>
      </div>
      <div className="header-box-title">{homeSettingData['header']?.headerName}</div>
      <div
        className="flex-box header-box-time"
        style={{
          fontSize: homeSettingData['header']?.headerTitleFontSize,
          alignItems: homeSettingData['header']?.titleAlign,
        }}
      >
        {started ? (
          <div
            className="flex-box header-box-time-status"
            style={{ fontSize: Math.max(homeSettingData['header']?.fontSize - 12, 20) }}
          >
            <div
              className="header-box-time-status-icon"
              style={{
                width: homeSettingData['header']?.headerTitleFontSize,
                height: homeSettingData['header']?.headerTitleFontSize,
              }}
            />
            在线
          </div>
        ) : null}
        <div style={{ height: homeSettingData['header']?.headerTitleFontSize }}>{time}</div>
      </div>
    </Fragment>
  );
};

export default HeaderCharts;
