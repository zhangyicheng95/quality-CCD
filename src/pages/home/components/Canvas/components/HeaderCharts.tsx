import React, { Fragment, useRef } from 'react';
import * as _ from 'lodash';
import useClock from '@/hooks/useClock';
import { BASE_IP } from '@/services/api';
import { connect, useModel } from 'umi';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
}

const HeaderCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started = false } = props;
  let {
    dataValue,
    fontSize,
    yName,
    xName,
    tableFontSize,
    des_layout,
    magnifierSize
  } = data;
  const domRef = useRef<any>();
  const { initialState } = useModel<any>('@@initialState');
  const { time } = useClock();
  if (process.env.NODE_ENV === 'development' && !dataValue) {
    dataValue =
      'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0';
  }

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.headerCharts}`}
      ref={domRef}
    >
      <div
        className="flex-box header-box-left"
        style={{
          fontSize: fontSize,
          alignItems: des_layout,
        }}
      >
        {
          ((
            _.isBoolean(initialState?.params?.contentData?.showLogo)
              ? initialState?.params?.contentData?.showLogo
              : true
          ) && !!localStorage.getItem('quality_icon'))
            ?
            (
              <img
                // @ts-ignore
                src={localStorage.getItem('quality_icon')?.indexOf('http') > -1 ?
                  localStorage.getItem('quality_icon')
                  :
                  `${BASE_IP}file_browser${localStorage.getItem('quality_icon')?.indexOf('\\') === 0 ? '' : '\\'}${localStorage.getItem('quality_icon')}?__timestamp=${+new Date()}`}
                alt="logo"
                className="header-box-left-logo"
                style={{
                  height: magnifierSize,
                  minHeight: magnifierSize,
                }}
              />
            ) : null
        }
        <div
          className="flex-box header-box-left-title"
          style={{ height: fontSize }}
        >
          {yName}
        </div>
      </div>
      <div className="header-box-title" style={{ fontSize: tableFontSize }}>{xName}</div>
      <div
        className="flex-box header-box-time"
        style={{
          alignItems: des_layout,
        }}
      >
        {started ? (
          <div
            className="flex-box header-box-time-status"
            style={{ fontSize: Math.max(fontSize - 12, 20) }}
          >
            <div
              className="header-box-time-status-icon success"
              style={{
                width: fontSize,
                height: fontSize,
              }}
            />
            在线
          </div>
        ) : null}
        <div style={{ height: fontSize, lineHeight: 1 }}>{time}</div>
      </div>
    </div>
  );
};

export default connect(({ home }) => ({
  started: home.started || false,
}))(HeaderCharts);
