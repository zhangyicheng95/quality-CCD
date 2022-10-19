import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Table, Button, DatePicker } from "antd";
import _ from "lodash";
import { guid } from "@/utils/utils";

const RangePicker: any = DatePicker.RangePicker;
const History: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();

  const columns = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center',
      render: (text, record, index) => index + 1
    },
    { key: 'orderId', dataIndex: 'orderId', title: '订单号' },
    { key: 'orderTime', dataIndex: 'orderTime', title: '订单时间' },
    { key: 'alarmImgCount', dataIndex: 'alarmImgCount', title: '报警图片数量', className: "col-alarm" },
    { key: 'falsyAlarmImgCount', dataIndex: 'falsyAlarmImgCount', title: '误报图片数量', className: "col-falsy" },
    { key: 'confirmedAlarmImgCount', dataIndex: 'confirmedAlarmImgCount', title: '异常图片数量', className: "col-confirmed" },
  ];
  return (
    <div className={styles.history}>
      <div className="title">
        工单列表
      </div>
      <div className="search-box">
        <Form
          form={form}
          className="page-history-order-query"
          initialValues={{}}
          onFinish={(values) => console.log(values)}
        >
          <div className="flex-box">
            <Form.Item label="时间" name="timeRange">
              <RangePicker showTime />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </div>
        </Form>
      </div>
      <Table
        columns={columns as any}
        dataSource={[{}, {}]}
        rowKey={(record: any) => record?.id || guid()}
        pagination={false}
      />
    </div>
  );
};

export default History;
