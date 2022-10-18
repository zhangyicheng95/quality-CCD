import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";

const Defect: React.FC<any> = (props: any) => {

  const [list, setList] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

  return (
    <div className={styles.defect}>
      <div className="chart-box">

      </div>
      <div className="chart-log">
        {
          [{ title: '缺陷类型', color: 'red' }, {}].map((item: any, index: number) => {
            const { title, color } = item;
            return <div className="log-item flex-box">
              <div className="log-item-color" style={{ background: color }} />
              {title}
            </div>
          })
        }
      </div>
      <div className="defect-box">
        {
          (list || []).map((item: any, index: number) => {
            return <div className="defect-item">

            </div>
          })
        }
      </div>
    </div>
  );
};

export default Defect;
