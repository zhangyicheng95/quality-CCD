import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { message, Form, Button, DatePicker } from "antd";
import _ from "lodash";
import { guid } from "@/utils/utils";
import moment from "moment";
import PrimaryTitle from "@/components/PrimaryTitle";
import { getAllHistory } from "@/services/api";
import BasicTable from "@/components/BasicTable";
import { useHistory } from "react-router";
import TooltipDiv from "@/components/TooltipDiv";

const RangePicker: any = DatePicker.RangePicker;
const HistoryList: React.FC<any> = (props: any) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [params, setParams] = useState<any>({ pageSize: 20, pageNum: 1, startTime: '', endTime: '' });

  useEffect(() => {
    getAllHistory(params).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setData(res.data);
      } else {
        message.error(res?.msg || '接口异常');
      }
    })
  }, [params]);
  const columns = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 60, align: 'center',
      render: (text: any, record: any, index: number) => index + 1
    },
    {
      key: 'orderId', dataIndex: 'orderId', title: '订单号', align: 'center',
      render: (text: any, record: any,) => <TooltipDiv title={text} placement="top" onClick={() => {
        history.push({ pathname: `/history/detail`, state: record });
      }}>{text}</TooltipDiv>
    },
    {
      key: 'orderTime', dataIndex: 'orderTime', title: '订单时间', align: 'center',
      render: (text: any, record: any, index: number) => {
        const { data = {} } = record;
        const { create_time } = data;
        return moment(new Date(!!create_time ? Number(create_time) : '')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // { key: 'alarmImgCount', dataIndex: 'alarmImgCount', title: '报警图片数量', align: 'center', },
    // { key: 'falsyAlarmImgCount', dataIndex: 'falsyAlarmImgCount', title: '误报图片数量', align: 'center', },
    // { key: 'confirmedAlarmImgCount', dataIndex: 'confirmedAlarmImgCount', title: '异常图片数量', align: 'center', },
  ];

  return (
    <div className={`${styles.history} page-size`}>
      <PrimaryTitle title={"工单列表"} />
      <div className="history-content-box">
        <div className="search-box">
          <Form
            form={form}
            className="page-history-order-query"
            initialValues={{}}
            onFinish={(values) => {
              const { timeRange } = values;
              setParams((prev: any) => Object.assign({}, prev, {
                startTime: new Date(timeRange[0]).getTime(),
                endTime: new Date(timeRange[1]).getTime(),
              }))
            }}
          >
            <div className="flex-box">
              <Form.Item label="时间" name="timeRange">
                <RangePicker showTime size="large" />
              </Form.Item>
              <Button type="primary" ghost htmlType="submit">
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
              setParams((prev: any) => Object.assign({}, prev, {
                pageSize: pageSize, pageNum: current,
              }))
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
