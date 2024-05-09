import React, { useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message } from 'antd';
import { btnFetch } from '@/services/api';
import FileManager from '@/components/FileManager';
import ChooseFileButton from '@/components/ChooseFileButton';
import SegmentSwitch from '@/components/SegmentSwitch';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const SegmentSwitchCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  const {
    fontSize = 14,
    yName = '',
    des_layout,
    des_bordered,
    timeSelectDefault = [],
    xName,
    fetchType,
    start,
    end,
  } = data;

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
        defaultValue={!!started}
        onChange={(e: any) => {
          if (e === 'start') {
            !!start && start?.();
          } else if (e === 'stop') {
            !!end && end?.();
          } else {
            btnFetch(fetchType, xName, { value: e }).then((res: any) => {
              if (!!res && res.code === 'SUCCESS') {
                message.success('success');
              } else {
                message.error(res?.message || '接口异常');
              }
            });
          }
        }}
      />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(SegmentSwitchCharts);
