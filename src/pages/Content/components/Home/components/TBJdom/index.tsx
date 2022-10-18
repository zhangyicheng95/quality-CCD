import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import Defect from "./components/Defect";
import Size from "./components/Size";

const TBJ: React.FC<any> = (props: any) => {

  const [tab, setTab] = useState('defect');
  return (
    <div className={`${styles.tbj} flex-box`}>
      <div className="tab-box flex-box">
        <div className="tab-item" style={tab === 'defect' ? { background: 'rgba(68, 68, 84, 0.8)' } : {}} onClick={() => setTab('defect')}>
          缺陷检测
        </div>
        <div className="tab-item" style={tab === 'size' ? { background: 'rgba(68, 68, 84, 0.8)' } : {}} onClick={() => setTab('size')} >
          尺寸测量
        </div>
      </div>

      {
        tab === 'defect' ?
          <Defect />
          :
          tab === 'size' ?
            <Size />
            :
            null
      }
    </div >
  );
};

export default TBJ;
