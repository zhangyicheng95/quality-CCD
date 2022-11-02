import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import moment from "moment";

const MFD: React.FC<any> = (props: any) => {
  const [data, setData] = useState([
    {
      type: 'NG',
      img: '',
      list: [
        { type: 'NG', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() }
      ]
    },
    {
      type: 'OK',
      img: '',
      list: [
        { type: 'NG', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() }
      ]
    },
    {
      type: 'NG',
      img: '',
      list: [
        { type: 'NG', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() }
      ]
    },
    {
      type: 'NG',
      img: '',
      list: [
        { type: 'NG', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() }
      ]
    },
    {
      type: 'NG',
      img: '',
      list: [
        { type: 'NG', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() },
        { type: 'OK', time: new Date().getTime() }
      ]
    }
  ]);
  return (
    <div className={`${styles.mfd} flex-box`}>
      {
        data.map((item: any, index: number) => {
          const { type, img, list } = item;
          return <div className="item-box flex-box" key={index}>
            <div className="item-top">
              <div className="top-img">
                {img}
              </div>
              <div className="item-type" style={type === 'NG' ? { background: 'rgb(182,28,36)' } : {}}>{type}</div>
            </div>
            <div className="item-bottom">
              {
                list.map((info: any, SecIndex: number) => {
                  const { type, time } = info;
                  return <div className="item-info flex-box" key={SecIndex}>
                    <div className="info-type" style={type === 'NG' ? { background: 'rgb(182,28,36)' } : {}}>{type}</div>
                    {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                })
              }
            </div>
          </div>
        })
      }
    </div>
  );
};

export default MFD;
