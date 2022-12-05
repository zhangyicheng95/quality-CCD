import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Popconfirm, Row, Table } from "antd";
import _ from "lodash";
import { convertToChinaNum } from "@/utils/utils";
import PointCharts from "./PointCharts";
import { systemType } from "@/common/constants/globalConstants";
import GridLayout from "@/components/GridLayout";

let timer: string | number | NodeJS.Timeout | null | undefined = null;
const Defect: React.FC<any> = (props: any) => {
  const {
    gridContentList = {}, setGridContentList, paramData, setParamData,
    setEditWindowData, setAddWindowVisible, edit
  } = props;
  const [defectList, setDefectList] = useState([
    { type: 'NG', position: { x: 0.01, y: 0.01 } },
    { type: 'OK', position: { x: 0.02, y: 0.02 } },
    { type: 'OK', position: { x: 0.03, y: 0.03 } },
    { type: 'OK', position: { x: 0.04, y: 0.04 } },
    { type: 'OK', position: { x: 0.05, y: 0.01 } },
    { type: 'OK', position: { x: 0.03, y: 0.01 } },
    { type: 'NG', position: { x: 0.07, y: 0.05 } },
    { type: 'OK', position: { x: 0.04, y: 0.08 } },
    { type: 'OK', position: { x: 0.1, y: 0.09 } },
    { type: 'OK', position: { x: 0.15, y: 0.3 } },
    { type: 'OK', position: { x: 0.1, y: 0.09 } },
    { type: 'OK', position: { x: 0.15, y: 0.3 } }
  ]);
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      let listData: any = [],
        layoutData: any = [];
      if (
        !_.isEmpty(gridContentList) &&
        Object.entries(gridContentList).filter((i: any) => i[1].type === systemType && i[1].tab === '2').length
      ) {
        Object.entries(gridContentList)
          .filter((i: any) => i[1].type === systemType && i[1].tab === '2')
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
                <PointCharts
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
      setList(listData.concat([
        <div className="chart-log" key={"defect-list-legend"}>
          {
            defectList.map((item: any, index: number) => {
              const { type } = item;
              return <div className="log-item flex-box" key={`log-${index}`}>
                <div className={`log-item-color ${type}`} />
                缺陷类型{convertToChinaNum(index + 1)}
              </div>
            })
          }
          <div className="custom-drag" />
        </div>,
        <div className="defect-box" key={"defect-list"}>
          {
            (defectList || []).map((item: any, index: number) => {
              const { type, position } = item;
              return <div className="defect-item" key={index}>
                <div className="flex-box item-top">
                  <div className={`item-type ${type}`}>
                    缺陷类型{convertToChinaNum(index + 1)}
                  </div>
                  <div className="item-img">

                  </div>
                </div>
                <div className="item-info">
                  X:{position.x}&nbsp;
                  Y:{position.y}
                </div>
              </div>
            })
          }
          <div className="custom-drag" />
        </div>
      ]));
      setLayout(layoutData.concat([
        { i: "defect-list-legend", x: 0, y: 0, w: 12, h: 3, minW: 2, maxW: 12, minH: 2, maxH: 32 },
        { i: "defect-list", x: 0, y: 0, w: 12, h: 13, minW: 2, maxW: 12, minH: 4, maxH: 32 }
      ]));
    }, 100);
  }, [gridContentList]);

  return (
    <div className={styles.defect}>
      {/* <div className="chart-box"> */}
      {
        !_.isEmpty(list) && !_.isEmpty(layout) ?
          <GridLayout
            margin={[24, 16]}
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
      {/* </div> */}
    </div>
  );
};

export default Defect;

const typeFormatColor = (type: any) => {
  switch (type) {
    case '1':
      return '#841010';
      break;

    default:
      return '#0d820d';
      break;
  }
}