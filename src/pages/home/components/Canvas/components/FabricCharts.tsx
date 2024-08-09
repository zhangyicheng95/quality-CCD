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
    dataValue = { type: '', data: [] },
    fontSize = 20,
    fetchType,
    xName, yName,
  } = data;


  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-column ${styles.fabricCharts}`}
      style={{ fontSize }}
    >
      <Fabritor1
        shapeFromData={dataValue}
        fetchType={fetchType}
        xName={xName}
        yName={yName}
      />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(FabricCharts);
