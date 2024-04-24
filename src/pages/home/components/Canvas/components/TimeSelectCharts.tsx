import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { AutoComplete, Button, DatePicker, message } from 'antd';
import { btnFetch } from '@/services/api';
import { useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';
import moment from 'moment';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const TimeSelectCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const { fontSize = 14, yName, xName = '', fetchType } = data;

  useEffect(() => {
    btnFetch(fetchType, xName, {}).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        message.success('success');
      } else {
        message.error(res?.message || '接口异常');
      }
    });
  }, []);

  const onChange = (dates: any, dateStrings: any) => {
    let param1 = {};
    if (dates) {
      if (_.isArray(dateStrings)) {
        param1 = { start: dateStrings[0], end: dateStrings[1] };
      } else {
        param1 = { time: dateStrings };
      }
    } else {
    }
    btnFetch(fetchType, xName, param1).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        message.success('success');
      } else {
        message.error(res?.message || '接口异常');
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-center ${styles.timeSelectCharts}`}
      style={{ fontSize }}
    >
      {yName === 'rangePicker' ? (
        // @ts-ignore
        <RangePicker
          defaultValue={[
            moment(new Date().toLocaleDateString(), dateFormat),
            moment(
              new Date(
                new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1,
              ),
              dateFormat,
            ),
          ]}
          ranges={{
            今日: [moment(), moment()],
            本周: [moment().startOf('week'), moment().endOf('week')],
            本月: [moment().startOf('month'), moment().endOf('month')],
          }}
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          onChange={onChange}
        />
      ) : yName === 'datePickerWidthTime' ? (
        // @ts-ignore
        <DatePicker showTime onChange={onChange} />
      ) : (
        // @ts-ignore
        <DatePicker onChange={onChange} />
      )}
    </div>
  );
};

export default TimeSelectCharts;
