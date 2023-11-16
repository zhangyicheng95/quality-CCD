import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Form, Button, DatePicker, Select, Input, AutoComplete, Row, Col } from 'antd';
import _ from 'lodash';
import PrimaryTitle from '@/components/PrimaryTitle';
import { getLogService } from '@/services/api';
import { useModel } from 'umi';
import moment from 'moment';

const LogList: React.FC<any> = (props: any) => {
  const { initialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;


  return (
    <div className={`${styles.fileList} page-size background-ubv`}>
      <PrimaryTitle title={'操作文档'} />
      <div className="flex-box file-content-box">

      </div>
    </div>
  );
};

export default LogList;
