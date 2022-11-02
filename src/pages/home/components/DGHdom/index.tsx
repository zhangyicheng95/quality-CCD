import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import moment from "moment";

const DGH: React.FC<any> = (props: any) => {
  const [data, setData] = useState({
    123: [
      { type: 'NG', time: new Date().getTime(), img: '' },
      { type: 'OK', time: new Date().getTime(), img: '' },
      { type: 'OK', time: new Date().getTime(), img: '' },
      { type: 'OK', time: new Date().getTime(), img: '' },
    ],
    234: [
      { type: 'NG', time: new Date().getTime(), img: '' },
      { type: 'NG', time: new Date().getTime(), img: '' },
      { type: 'OK', time: new Date().getTime(), img: '' },
    ],
  });
  return (
    <div className={`${styles.dgh} flex-box`}>
      {
        Object.entries(data).map((item: any, index: number) => {
          return <div className="item-box flex-box" key={item[0]}>
            <div className="left">
              {
                item[1].map((data: any, index: number) => {
                  const { type, time } = data;
                  return <div className="left-item flex-box" key={index}>
                    <div className="item-type" style={type === 'NG' ? { background: 'rgb(182,28,36)' } : {}}>{type}</div>
                    {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                })
              }
            </div>
            <div className="right flex-box">
              {
                item[1].map((data: any, index: number) => {
                  const { type, } = data;
                  return <div className="right-item" key={index}>
                    <div className="item-img"></div>
                    <div className="item-type" style={type === 'NG' ? { background: 'rgb(182,28,36)' } : {}}>{type}</div>
                  </div>
                })
              }
            </div>
          </div>
        })
      }
    </div >
  );
};

export default DGH;
