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
        <div className="tab-item" style={tab === 'defect' ? { background: '#f5f5f5' } : {}} onClick={() => setTab('defect')}>
          缺陷检测
        </div>
        <div className="tab-item" style={tab === 'size' ? { background: '#f5f5f5' } : {}} onClick={() => setTab('size')} >
          尺寸测量
        </div>
      </div>
      <div className="tbj-body">
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
    </div>
  );
};

export default TBJ;
