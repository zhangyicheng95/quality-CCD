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
  const {
    fontSize = 14,
    yName,
    xName = '',
    fetchType,
    timeSelectDefault = 'day',
    modelRotate,
  } = data;

  useEffect(() => {
    if (!!modelRotate) {
      btnFetch(
        fetchType,
        xName,
        timeSelectDefault === 'month'
          ? {
              start: moment(
                new Date(
                  new Date(new Date().toLocaleDateString()).getTime() - 29 * 24 * 60 * 60 * 1000,
                ),
              ).format(dateFormat),
              end: moment(
                new Date(),
                // new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1,
              ).format(dateFormat),
            }
          : timeSelectDefault === 'week'
          ? {
              start: moment(
                new Date(
                  new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 60 * 60 * 1000,
                ),
              ).format(dateFormat),
              end: moment(new Date()).format(dateFormat),
            }
          : {
              start: moment(new Date().toLocaleDateString()).format(dateFormat),
              end: moment(new Date()).format(dateFormat),
            },
      ).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
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
        message.error(res?.message || '后台服务异常，请重启服务');
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
            moment(
              timeSelectDefault === 'month'
                ? new Date(
                    new Date(new Date().toLocaleDateString()).getTime() - 29 * 24 * 60 * 60 * 1000,
                  )
                : timeSelectDefault === 'week'
                ? new Date(
                    new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 60 * 60 * 1000,
                  )
                : new Date().toLocaleDateString(),
              dateFormat,
            ),
            moment(new Date(), dateFormat),
          ]}
          ranges={{
            今日: [
              moment(new Date().toLocaleDateString(), dateFormat),
              moment(new Date(), dateFormat),
            ],
            过去一周: [
              moment(
                new Date(
                  new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 60 * 60 * 1000,
                ),
                dateFormat,
              ),
              moment(new Date(), dateFormat),
            ],
            过去一个月: [
              moment(
                new Date(
                  new Date(new Date().toLocaleDateString()).getTime() - 29 * 24 * 60 * 60 * 1000,
                ),
                dateFormat,
              ),
              moment(new Date(), dateFormat),
            ],
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
