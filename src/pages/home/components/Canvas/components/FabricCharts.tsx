import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Button, Form, message, Modal } from 'antd';
import styles from '../index.module.less';
import { btnFetch } from '@/services/api';
import CustomWindowBody from '@/components/CustomWindowBody';
import { FormatWidgetToDom } from './Operation2Charts';
import BasicTable from '@/components/BasicTable';
import { guid } from '@/utils/utils';
import { connect } from 'umi';
import Fabritor1 from '@/components/fabritor';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const FabricCharts: React.FC<Props> = (props: any) => {
  let { data = {}, id, started } = props;
  let {
    dataValue = [],
    fontSize = 20,
    fetchType,
    xName,
  } = data;


  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-column ${styles.fabricCharts}`}
      style={{ fontSize }}
    >
      <Fabritor1 shapeFromData={dataValue} onLoadTypeChange={(param: any) => {
        if (!!xName) {
          btnFetch(fetchType, xName, param).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {

            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
          });
        }
      }} />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(FabricCharts);
