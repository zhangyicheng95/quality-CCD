import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import moment from "moment";
import LineCharts from "./components/LineCharts";

const FC: React.FC<any> = (props: any) => {
  const [tab, setTab] = useState('1');
  const [chartData, setChartData] = useState({
    1: [[new Date().getTime(), 10], [new Date().getTime() + 24 * 60 * 60 * 1000, 30], [new Date().getTime() + 2 * 24 * 60 * 60 * 1000, 100]],
    2: [[new Date().getTime(), 20], [new Date().getTime() + 24 * 60 * 60 * 1000, 10]],
    3: [[new Date().getTime(), 60], [new Date().getTime() + 24 * 60 * 60 * 1000, 70]]
  });
  const [list, setList] = useState([{}, {}, {}, {}, {}, {}, {},]);
  return (
    <div className={`${styles.fc} flex-box`}>
      <div className="tab-box flex-box">
        <div className="tab-item" style={tab === '1' ? { background: '#f5f5f5' } : {}} onClick={() => setTab('1')}>
          工位一
        </div>
        <div className="tab-item" style={tab === '2' ? { background: '#f5f5f5' } : {}} onClick={() => setTab('2')} >
          工位二
        </div>
      </div>

      <div className="fc-content-box">
        <div className="charts-box">
          <LineCharts
            id={1}
            data={chartData}
          />
        </div>
        <div className="list-box">
          {
            (list || []).map((item: any, index: number) => {
              return <div className="item-box" key={index}>

              </div>
            })
          }
        </div>
      </div>
    </div>
  );
};

export default FC;
