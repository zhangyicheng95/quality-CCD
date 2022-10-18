import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import TBJ from "./components/TBJdom";
import DGH from "./components/DGHdom";
import DPJ from "./components/DPJdom";
import Common from "./components/Commondom";

const Home: React.FC<any> = (props: any) => {
  // @ts-ignore
  const { type } = window.QUALITY_CCD_CONFIG;
  return (
    <div className={`${styles.home} flex-box`}>
      {
        type === 'tbj' ?
          <TBJ />
          :
          type === 'dgh' ?
            <DGH />
            :
            type === 'dpj' ?
              <DPJ />
              :
              <Common />
      }
    </div>
  );
};

export default Home;
