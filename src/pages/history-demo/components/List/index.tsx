import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Form, Button, DatePicker, Select, Input } from 'antd';
import _ from 'lodash';
import { guid } from '@/utils/utils';
import PrimaryTitle from '@/components/PrimaryTitle';
import { getAllHistory } from '@/services/api';
import BasicTable from '@/components/BasicTable';
import TooltipDiv from '@/components/TooltipDiv';
import { useHistory } from 'react-router';

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
  const [form] = Form.useForm();
  const history = useHistory();
  const [data, setData] = useState([
    { name: '第一个', materialCode: 'TB2068K8896', algStatus: 'OK' },
    { name: '第二个', materialCode: 'TB2068K8897', algStatus: '' },
    { name: '第三个', materialCode: 'TB2068K8898', algStatus: 'NG' }
  ]);
  const [params, setParams] = useState<any>({
    pageSize: 20,
    pageNum: 1,
    type: 'size',
  });

  const updateFun = (res: any) => {
    if (res?.code === 'SUCCESS' || res?.code === 200) {
      const { list, pageNum, pageSize, total, } = res.data;
      setData(list);
      setParams((prev: any) => Object.assign({}, prev, { pageNum, pageSize, total }));
    } else {
      message.error(res?.msg || res?.message || '接口异常');
    }
  };

  const getList = (param: any) => {
    // if (param.type === 'size') {
    //   getAllHistorySize(param).then((res: any) => {
    //     updateFun(res);
    //   });
    // } else {
    getAllHistory(param).then((res: any) => {
      updateFun(res);
    });
    // }
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
      key: 'name',
      dataIndex: 'name',
      title: '名称',
      width: 150,
      align: 'center',
      render: (text: any, record: any) => (
        <TooltipDiv
          title={text}
          placement="top"
          onClick={() => {
            history.push({
              pathname: '/history/detail',
              state: {
                store_path: 'https://seopic.699pic.com/photo/40015/5662.jpg_wh1200.jpg',
                value: [
                  { "id": "1667626430557", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626430557", "deleteMarkerId": "label-marker-id-1667626430557" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 100.17761989342807, "y": 34.928952042628765, "sr": 3 } },
                  { "id": "1667626431009", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431009", "deleteMarkerId": "label-marker-id-1667626431009" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 216.696269982238, "y": 36.34991119005328, "sr": 3 } },
                  { "id": "1667626431412", "type": "POINT", "props": { "name": "点状矢量图层", "textId": "label-text-id-1667626431412", "deleteMarkerId": "label-marker-id-1667626431412" }, "style": { "opacity": 1, "fillStyle": "#9370DB", "lineWidth": 1, "strokeStyle": "#000" }, "option": { "active": false }, "shape": { "x": 164.83126110124334, "y": 132.26465364120781, "sr": 3 } },
                  { "id": "1667715256283", "type": "LINE", "props": { "name": "线段矢量图层", "textId": "label-text-id-1667715256283", "deleteMarkerId": "label-marker-id-1667715256283" }, "style": { "opacity": 1, "fillStyle": "rgba(255, 0, 0, 0)", "lineWidth": 10, "strokeStyle": "#FF00FF", "lineJoin": "round", "lineCap": "round", "arrow": false }, "shape": { "start": { "x": 125.84269662921349, "y": 213.72659176029964 }, "end": { "x": 240.8988764044944, "y": 190.95505617977528 }, "width": 5.992509363295881 } },
                  { "id": "1667715268027", "type": "POLYGON", "props": { "name": "多边形矢量图形", "textId": "label-text-id-1667715268027", "deleteMarkerId": "label-marker-id-1667715268027" }, "style": { "opacity": 1, "fillStyle": "#0f0", "lineWidth": 1, "strokeStyle": "#00f", "globalAlpha": 0.3, "fill": true, "stroke": true }, "shape": { "points": [{ "x": 193.55805243445693, "y": 98.67041198501872 }, { "x": 279.250936329588, "y": 106.46067415730337 }, { "x": 247.49063670411985, "y": 157.39700374531836 }, { "x": 226.51685393258427, "y": 150.8052434456929 }], "location": { "x": 193.55805243445693, "y": 98.67041198501872 } } }
                ],
                zoom: 1308,
              },
            });
          }}
        >
          {text}
        </TooltipDiv>
      ),
    },
    {
      key: 'materialCode',
      dataIndex: 'materialCode',
      title: '物料号',
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
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      title: '图片URL',
      width: 200,
      align: 'center',
      render: (text: any, record: any) => {
        const result = text?.split('/');
        return !!result ?
          <TooltipDiv
            title={text}
            placement="top"
          >
            <a href={text} target="_blank">{result[result.length - 1]}</a>
          </TooltipDiv>
          :
          null
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
                loLimit: timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
                upLimit: timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
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
              <Form.Item label="名称" name="colName">
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
              const result = Object.assign({}, params, {
                pageSize: pageSize,
                pageNum: current,
              });
              getList(result);
              setParams(result);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
