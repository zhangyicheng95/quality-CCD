import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";

const Common: React.FC<any> = (props: any) => {

  const [list, setList] = useState([{}, {}, {}, {}, ]);

  return (
    <div className={styles.common}>
      {
        (list || []).map((item: any, index: number) => {
          return <div className="item-box">

          </div>
        })
      }
    </div>
  );
};

export default Common;
