import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { message, Form, Table, Button, DatePicker } from "antd";
import _ from "lodash";
import { guid } from "@/utils/utils";
import moment from "moment";
import HomeLayout from "@/components/HomeLayout";
import PrimaryTitle from "@/components/PrimaryTitle";
import { getAllProject } from "@/services/api";

const RangePicker: any = DatePicker.RangePicker;
const History: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllProject().then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setData(res.data);
      } else {
        message.error(res?.msg || '接口异常');
      }
    })
  }, []);
  const columns = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 60, align: 'center',
      render: (text: any, record: any, index: number) => index + 1
    },
    { key: 'id', dataIndex: 'id', title: '订单号', align: 'center', },
    {
      key: 'orderTime', dataIndex: 'orderTime', title: '订单时间', align: 'center',
      render: (text: any, record: any, index: number) => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    { key: 'alarmImgCount', dataIndex: 'alarmImgCount', title: '报警图片数量', align: 'center', },
    { key: 'falsyAlarmImgCount', dataIndex: 'falsyAlarmImgCount', title: '误报图片数量', align: 'center', },
    { key: 'confirmedAlarmImgCount', dataIndex: 'confirmedAlarmImgCount', title: '异常图片数量', align: 'center', },
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
            onFinish={(values) => console.log(values)}
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
        <Table
          columns={columns as any}
          dataSource={data}
          rowKey={(record: any) => record?.id || guid()}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default History;
