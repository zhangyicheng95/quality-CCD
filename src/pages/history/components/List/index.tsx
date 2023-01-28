import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Form, Button, DatePicker, Segmented, Select, Input } from 'antd';
import _ from 'lodash';
import { guid } from '@/utils/utils';
import moment from 'moment';
import PrimaryTitle from '@/components/PrimaryTitle';
import { getAllHistory, getAllHistorySize } from '@/services/api';
import BasicTable from '@/components/BasicTable';
import { useHistory } from 'react-router';
import TooltipDiv from '@/components/TooltipDiv';

const LABEL_RESULT = {
  "OK": "正常",
  "": "未审核",
  "NG": "异常",
};
const CLASS_RESULT = {
  "OK": "success-font",
  "": "normal-font",
  "NG": "error-font",
};

const RangePicker: any = DatePicker.RangePicker;
const HistoryList: React.FC<any> = (props: any) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [params, setParams] = useState<any>({
    pageSize: 20,
    pageNum: 1,
    startTime: '',
    endTime: '',
    type: 'size',
  });

  const updateFun = (res: any) => {
    if (res?.code === 'SUCCESS' || res?.code === 200) {
      const { list, pageNum, pageSize, total, } = res.result;
      setData(list);
      setParams((prev: any) => Object.assign({}, prev, { pageNum, pageSize, total }));
    } else {
      message.error(res?.msg || '接口异常');
    }
  };

  const getList = (param: any) => {
    if (param.type === 'size') {
      getAllHistorySize(param).then((res: any) => {
        updateFun(res);
      });
    } else {
      getAllHistory(param).then((res: any) => {
        updateFun(res);
      });
    }
  };
  useEffect(() => {
    getList(params);
  }, []);

  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: 60,
      align: 'center',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      key: 'materialCode',
      dataIndex: 'materialCode',
      title: '物料号',
      width: 150,
      align: 'center',
      render: (text: any, record: any) => (
        <TooltipDiv
          title={text}
          placement="top"
        // onClick={() => {
        //   history.push({ pathname: `/history/detail`, state: record });
        // }}
        >
          {text}
        </TooltipDiv>
      ),
    },
    {
      key: 'deviceCode',
      dataIndex: 'deviceCode',
      title: '相机IP',
      width: 150,
      align: 'center',
      render: (text: any, record: any) => (
        <TooltipDiv
          title={text}
          placement="top"
        >
          {text}
        </TooltipDiv>
      ),
    },
    {
      key: 'captureTime',
      dataIndex: 'captureTime',
      title: '检测时间',
      align: 'center',
      // render: (text: any, record: any, index: number) => {
      //   const { data = {} } = record;
      //   const { create_time } = data;
      //   return moment(new Date(!!create_time ? Number(create_time) : '')).format(
      //     'YYYY-MM-DD HH:mm:ss',
      //   );
      // },
    },
    {
      key: 'location',
      dataIndex: 'location',
      title: '位置信息（米）',
      width: 130,
      align: 'center',
      render: (text: any, record: any) => text,
    },
    {
      key: 'imageName',
      dataIndex: 'imageName',
      title: '图片URL',
      width: 200,
      align: 'center',
      render: (text: any, record: any) => {
        const { imageUrl } = record;
        return <TooltipDiv
          title={text}
          placement="top"
          onClick={() => {
            window.open(imageUrl);
          }}
        >
          {text}
        </TooltipDiv>
      },
    },
    {
      key: 'algStatus',
      dataIndex: 'algStatus',
      title: '检测状态',
      width: 100,
      align: 'center',
      render: (text: any, record: any) => {
        return <span className={CLASS_RESULT[text]}>
          {LABEL_RESULT[text]}
        </span>
      },
    },
  ];

  return (
    <div className={`${styles.historyList} page-size background-ubv`}>
      <PrimaryTitle title={'历史记录'} />
      <div className="history-content-box flex-box">
        <div className="search-box">
          <Form
            form={form}
            className="page-history-order-query"
            initialValues={{}}
            onFinish={(values) => {
              const { timeRange, ...rest } = values;
              const result = Object.assign({}, params, rest, !!timeRange ? {
                startTime: new Date(timeRange[0]).getTime(),
                endTime: new Date(timeRange[1]).getTime(),
              } : {});
              getList(result);
              setParams(result);
            }}
          >
            <div className="flex-box">
              <Form.Item label="时间" name="timeRange">
                <RangePicker showTime size="large" />
              </Form.Item>
              <Form.Item label="类型" name="type" initialValue={"size"}>
                <Select size="large" options={[
                  { label: '尺寸', value: 'size' },
                  { label: '缺陷', value: 'defect' }
                ]} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item label="物料号" name="materialCode">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </div>
          </Form>
        </div>
        <div className="table-box">
          <BasicTable
            columns={columns as any}
            dataSource={data}
            rowKey={(record: any) => record?.id || guid()}
            onChange={(data: any) => {
              const { current, pageSize } = data;
              console.log(current, pageSize);
              setParams((prev: any) =>
                Object.assign({}, prev, {
                  pageSize: pageSize,
                  pageNum: current,
                }),
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
