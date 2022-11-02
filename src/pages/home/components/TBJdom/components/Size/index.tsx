import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Table, Button } from "antd";
import _ from "lodash";
import LineCharts from "./LineCharts";
import { GifOutlined } from "@ant-design/icons";
import { guid } from "@/utils/utils";

const Size: React.FC<any> = (props: any) => {

  const columns1 = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      key: 'orderId', dataIndex: 'orderId', title: '涂层(mm)',
    },
    {
      key: 'id', dataIndex: 'id', title: '陶瓷 + 涂层(mm)',
    },
  ];
  const columns2 = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      key: 'orderId', dataIndex: 'orderId', title: '涂层(mm)',
    },
    {
      key: 'id', dataIndex: 'id', title: '陶瓷 + 涂层(mm)',
    },
  ];
  const columns3 = [
    {
      key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      key: 'orderId', dataIndex: 'orderId', title: '纠偏幅度',
    },
  ];
  return (
    <div className={`${styles.size} flex-box`}>
      <div className="table-box flex-box">
        <div className="item-table">
          <div className="title">左侧极片尺寸</div>
          <Table
            columns={columns1 as any}
            dataSource={[{}, {}]}
            rowKey={(record: any) => record?.id || guid()}
            pagination={false}
          />
        </div>
        <div className="item-table">
          <div className="title">右侧极片尺寸</div>
          <Table
            columns={columns2 as any}
            dataSource={[{}, {}]}
            rowKey={(record: any) => record?.id || guid()}
            pagination={false}
          />
        </div>
        <div className="item-table" style={{ flex: 1 }}>
          <div className="title">纠偏尺寸</div>
          <Table
            columns={columns3 as any}
            dataSource={[{}, {}]}
            rowKey={(record: any) => record?.id || guid()}
            pagination={false}
          />
        </div>
      </div>
      <div className="chart-box flex-box">
        <div className="chart-item">
          <LineCharts
            id={1}
            data={[[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]]}
          />
        </div>
        <div className="chart-item">
          <LineCharts
            id={2}
            data={[[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]]}
          />
        </div>
        <div className="chart-item">
          <LineCharts
            id={3}
            data={[[new Date().getTime(), 40], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]]}
          />
        </div>
      </div>
    </div>
  );
};

export default Size;
