import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Form, Button, DatePicker, Select, Input, AutoComplete, Row, Col } from 'antd';
import _ from 'lodash';
import PrimaryTitle from '@/components/PrimaryTitle';
import { getLogService } from '@/services/api';
import { useModel } from 'umi';
import moment from 'moment';

const RangePicker: any = DatePicker.RangePicker;
const LogList: React.FC<any> = (props: any) => {
  const ipString: any = localStorage.getItem('ipString') || '';
  const { initialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const [form] = Form.useForm();
  const [logStr, setLogStr] = useState([]);
  const [params, setParams] = useState<any>({
    pageSize: 100,
    pageNum: 1,
    totals: 2,
    keywords: [],
    startTime: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
    endTime: new Date().getTime()
  });

  const getLog = (params: any) => {
    if (!params?.keywords || !params?.keywords?.length) {
      message.warning('请输入关键词');
      return;
    }
    if (!params?.startTime || !params?.endTime) {
      message.warning('请输入开始时间/结束时间');
      return;
    }
    getLogService(ipString, params).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        if (!!res?.data && !!res?.data?.length) {
          setLogStr(res?.data);
          setParams((prev: any) => ({ ...prev, totals: prev.pageNum + 1 }));
        } else {
          setParams((prev: any) => ({ ...prev, totals: prev.pageNum }));
        }
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    })
  };
  useEffect(() => {
    getLog(params);
  }, []);

  return (
    <div className={`${styles.logList} page-size background-ubv`}>
      <PrimaryTitle title={'日志信息'} />
      <div className="flex-box log-content-box">
        <div className="search-box">
          <Form
            form={form}
            layout="inline"
            className="page-log-order-query"
            initialValues={{}}
            onFinish={(values) => {
              const { timeRange, ...rest } = values;
              const result = Object.assign({}, params, rest, !!timeRange ? {
                startTime: new Date(timeRange[0]).getTime(),
                endTime: new Date(timeRange[1]).getTime(),
              } : {});
              setParams(result);
              getLog(result);
            }}
          >
            <Form.Item label="时间段" name="timeRange" initialValue={[
              moment(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
              moment(new Date().getTime())
            ]}>
              <RangePicker showTime style={{ width: 370 }} />
            </Form.Item>
            <Form.Item label="关键词" name="keywords">
              <Select mode="tags" options={(paramsData?.flowData?.nodes).map((option: any) => {
                const { alias, name, id } = option;
                return { label: alias || name, value: alias || name, key: id }
              })} style={{ width: 400 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            {/* </div> */}
          </Form>
        </div>
        <div className="table-box">
          {
            (logStr || [])?.map((item: any, index: number) => {
              const { createdAt, message } = item;
              return <div className="content-item-span" key={`keyword-${index}-${createdAt}`}>
                {`${message}`}
              </div>
            })
          }
        </div>
        <div className="flex-box-center log-footer">
          <Button
            disabled={params?.pageNum <= 1}
            onClick={() => {
              const result = { ...params, pageNum: params.pageNum - 1 };
              setParams(result);
              getLog(result);
            }}
          >
            上一页
          </Button>
          <Button
            disabled={params?.pageNum >= params?.totals}
            onClick={() => {
              const result = { ...params, pageNum: params.pageNum + 1 };
              setParams(result);
              getLog(result);
            }}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogList;
