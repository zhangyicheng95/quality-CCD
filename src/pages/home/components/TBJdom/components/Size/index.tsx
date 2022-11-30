import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Table, Image, Popconfirm } from "antd";
import _ from "lodash";
import GridLayout from "@/components/GridLayout";
import LineCharts from "./LineCharts";
import { guid } from "@/utils/utils";
import { systemType } from "@/common/constants/globalConstants";

let timer: string | number | NodeJS.Timeout | null | undefined = null;
const Size: React.FC<any> = (props: any) => {
  const {
    gridContentList = {}, setGridContentList, paramData, setParamData,
    setEditWindowData, setAddWindowVisible, edit
  } = props;
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      let listData: any = [],
        layoutData: any = [];
      if (!_.isEmpty(gridContentList)) {
        Object.entries(gridContentList)
          .filter((i: any) => i[1].type === systemType && i[1].tab === '1')
          .forEach((item: any, index: number) => {
            const key = item[0];
            if (_.isEmpty(item[1])) { return; }
            const { size, data } = item[1];
            listData = listData.concat(
              <div key={key} className="flex-box drag-item-content-box" >
                <div className="flex-box-center drag-item-btn-box" >
                  <div style={{ cursor: 'pointer' }} onClick={() => {
                    setEditWindowData(item[1]);
                    setAddWindowVisible(true);
                  }}>编辑</div>
                  <Popconfirm
                    title="确认删除监控窗口吗?"
                    onConfirm={() => {
                      const result = _.omit(gridContentList, key);
                      const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { content: result }) });
                      setGridContentList(result);
                      setParamData(params);
                    }}
                    okText="确认"
                    cancelText="取消"
                  >
                    <div style={{ cursor: 'pointer' }}>删除</div>
                  </Popconfirm>
                </div>
                <LineCharts
                  id={key}
                  data={data || {
                    normal: {
                      data: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 15]],
                      upperThreshold: 16,
                      lowerThreshold: 7,
                    },
                    abNormal: {
                      data: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 30]],
                      upperThreshold: 32,
                      lowerThreshold: 19,
                    },
                  }}
                />
                <div className="custom-drag" />
              </div>
            );
            layoutData = layoutData.concat(size)
          });
      }
      setList(listData);
      setLayout(layoutData);
    }, 100);
  }, [gridContentList]);
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
      <div className="chart-box">
        {
          !_.isEmpty(list) && !_.isEmpty(layout) ?
            <GridLayout
              edit={edit}
              list={list}
              layout={layout}
              onChange={(data: any) => {
                const result = Object.entries(gridContentList).reduce((pre: any, cen: any) => {
                  return Object.assign({}, pre, {
                    [cen[0]]: Object.assign({}, cen[1], !!data.filter((i: any) => i.i === cen[0])[0] ? {
                      size: data.filter((i: any) => i.i === cen[0])[0]
                    } : {}),
                  });
                }, {});
                const params = Object.assign({}, paramData, { contentData: Object.assign({}, paramData.contentData, { content: result }) });
                setGridContentList(result);
                setParamData(params);
              }}
            />
            : null
        }
      </div>
    </div>
  );
};

export default Size;

const columns1 = [
  {
    key: 'index', dataIndex: 'index', title: '序号', width: 60, align: 'center',
    render: (text: any, record: any, index: number) => index + 1
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
    key: 'index', dataIndex: 'index', title: '序号', width: 60, align: 'center',
    render: (text: any, record: any, index: number) => index + 1
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
    key: 'index', dataIndex: 'index', title: '序号', width: 60, align: 'center',
    render: (text: any, record: any, index: number) => index + 1
  },
  {
    key: 'orderId', dataIndex: 'orderId', title: '纠偏幅度',
  },
];