import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import { convertToChinaNum } from "@/utils/utils";

const Defect: React.FC<any> = (props: any) => {

  const [list, setList] = useState([
    { type: 1, position: { x: 0.01, y: 0.01 } },
    { type: 2, position: { x: 0.02, y: 0.02 } },
    { type: 3, position: { x: 0.03, y: 0.03 } },
    { type: 4, position: { x: 0.04, y: 0.04 } },
    { type: 5, position: { x: 0.05, y: 0.01 } },
    { type: 6, position: { x: 0.03, y: 0.01 } },
    { type: 7, position: { x: 0.07, y: 0.05 } },
    { type: 8, position: { x: 0.04, y: 0.08 } },
    { type: 9, position: { x: 0.1, y: 0.09 } },
    { type: 10, position: { x: 0.15, y: 0.3 } }
  ]);

  return (
    <div className={styles.defect}>
      <div className="chart-box">
        {
          (list || []).map((item: any, index: number) => {
            const { type, position } = item;
            return <div className="chart-item" key={`chart-${index}`}
              style={{
                background: typeFormatColor(type + ''),
                left: `${position.x * 100}%`,
                top: `${position.y * 100}%`,
              }}
            />
          })
        }
      </div>
      <div className="chart-log flex-box">
        {
          list.map((item: any, index: number) => {
            const { type } = item;
            return <div className="log-item flex-box" key={`log-${index}`}>
              <div className="log-item-color" style={{ background: typeFormatColor(type + '') }} />
              缺陷类型{convertToChinaNum(type)}
            </div>
          })
        }
      </div>
      <div className="defect-box">
        {
          (list || []).map((item: any, index: number) => {
            const { type, position } = item;
            return <div className="defect-item" key={index}>
              <div className="flex-box item-top">
                <div className="item-type" style={{ background: typeFormatColor(type + '') }}>
                  缺陷类型{convertToChinaNum(type)}
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
      </div>
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