import React, { useEffect, useRef, useState } from "react";
import { Button, message, Table, Form, DatePicker } from 'antd';
import PrimaryTitle from "@/components/PrimaryTitle";
import styles from "./index.less";
import TooltipDiv from "../../../../components/TooltipDiv";
import BasicTable from "../../../../components/BasicTable";
import moment from "moment";
import { useHistory } from "react-router";
import { getAllProject } from "@/services/api";
import { guid } from "@/utils/utils";

const RangePicker: any = DatePicker.RangePicker;
const MarkList: React.FC = (props: any) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [params, setParams] = useState<any>({
    pageSize: 20,
    pageNum: 1,
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    getAllProject().then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setList(res?.data);
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '100%',
      render: (text: any, record: any,) => <TooltipDiv title={text} onClick={() => {
        history.push({
          pathname: `/mark/detail`,
          state: {
            value: 'https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg',
            platFormValue: [
              { "id": "1667626430557", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626430557", "deleteMarkerId": "label-marker-id-1667626430557" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 100.17761989342807, "y": 34.928952042628765, "sr": 3 } },
              { "id": "1667626431009", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431009", "deleteMarkerId": "label-marker-id-1667626431009" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 216.696269982238, "y": 36.34991119005328, "sr": 3 } },
              { "id": "1667626431412", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431412", "deleteMarkerId": "label-marker-id-1667626431412" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 164.83126110124334, "y": 132.26465364120781, "sr": 3 } },
              { "id": "1667715256283", "type": "LINE", "props": { "name": "线段矢量图层", "textId": "label-text-id-1667715256283", "deleteMarkerId": "label-marker-id-1667715256283" }, "style": { "opacity": 1, "fillStyle": "rgba(255, 0, 0, 0)", "lineWidth": 10, "strokeStyle": "#FF00FF", "lineJoin": "round", "lineCap": "round", "arrow": false }, "shape": { "start": { "x": 125.84269662921349, "y": 213.72659176029964 }, "end": { "x": 240.8988764044944, "y": 190.95505617977528 }, "width": 5.992509363295881 } },
              { "id": "1667715268027", "type": "POLYGON", "props": { "name": "多边形矢量图形", "textId": "label-text-id-1667715268027", "deleteMarkerId": "label-marker-id-1667715268027" }, "style": { "opacity": 1, "fillStyle": "#0f0", "lineWidth": 1, "strokeStyle": "#00f", "globalAlpha": 0.3, "fill": true, "stroke": true }, "shape": { "points": [{ "x": 193.55805243445693, "y": 98.67041198501872 }, { "x": 279.250936329588, "y": 106.46067415730337 }, { "x": 247.49063670411985, "y": 157.39700374531836 }, { "x": 226.51685393258427, "y": 150.8052434456929 }], "location": { "x": 193.55805243445693, "y": 98.67041198501872 } } }
            ],
            zoom: 1308,
          }
        });
      }}>{text}</TooltipDiv>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '102px',
      render: (text: any, record: any) => {
        return (
          <div>
            <a
              onClick={() => {
                history.push({
                  pathname: `/mark/detail`,
                  state: {
                    value: 'https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg',
                    platFormValue: [
                      { "id": "1667626430557", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626430557", "deleteMarkerId": "label-marker-id-1667626430557" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 100.17761989342807, "y": 34.928952042628765, "sr": 3 } },
                      { "id": "1667626431009", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431009", "deleteMarkerId": "label-marker-id-1667626431009" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 216.696269982238, "y": 36.34991119005328, "sr": 3 } },
                      { "id": "1667626431412", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431412", "deleteMarkerId": "label-marker-id-1667626431412" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 164.83126110124334, "y": 132.26465364120781, "sr": 3 } },
                      { "id": "1667715256283", "type": "LINE", "props": { "name": "线段矢量图层", "textId": "label-text-id-1667715256283", "deleteMarkerId": "label-marker-id-1667715256283" }, "style": { "opacity": 1, "fillStyle": "rgba(255, 0, 0, 0)", "lineWidth": 10, "strokeStyle": "#FF00FF", "lineJoin": "round", "lineCap": "round", "arrow": false }, "shape": { "start": { "x": 125.84269662921349, "y": 213.72659176029964 }, "end": { "x": 240.8988764044944, "y": 190.95505617977528 }, "width": 5.992509363295881 } },
                      { "id": "1667715268027", "type": "POLYGON", "props": { "name": "多边形矢量图形", "textId": "label-text-id-1667715268027", "deleteMarkerId": "label-marker-id-1667715268027" }, "style": { "opacity": 1, "fillStyle": "#0f0", "lineWidth": 1, "strokeStyle": "#00f", "globalAlpha": 0.3, "fill": true, "stroke": true }, "shape": { "points": [{ "x": 193.55805243445693, "y": 98.67041198501872 }, { "x": 279.250936329588, "y": 106.46067415730337 }, { "x": 247.49063670411985, "y": 157.39700374531836 }, { "x": 226.51685393258427, "y": 150.8052434456929 }], "location": { "x": 193.55805243445693, "y": 98.67041198501872 } } }
                    ],
                    zoom: 1308,
                  }
                });
              }}
            >
              编辑
            </a>
            <span className="operation-line">|</span>
            <a onClick={() => {

            }}>删除</a>
          </div>
        );
      },
    },
  ];

  return <div className={`${styles.markList} page-size background-ubv`}>
    <PrimaryTitle title={'标注数据列表'} />
    <div className="history-content-box">
      <div className="search-box">
        <Form
          form={form}
          className="page-history-order-query"
          initialValues={{}}
          onFinish={(values) => {
            const { timeRange } = values;
            setParams((prev: any) =>
              Object.assign({}, prev, {
                startTime: new Date(timeRange[0]).getTime(),
                endTime: new Date(timeRange[1]).getTime(),
              }),
            );
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
          columns={columns}
          // pagination={null}
          dataSource={list}
          rowKey={(record: { id: any }) => {
            return record.id || guid();
          }}
        />
      </div>
    </div>
  </div>;
};

export default MarkList;
