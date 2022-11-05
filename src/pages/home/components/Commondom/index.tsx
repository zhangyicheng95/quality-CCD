import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import { layoutTransform } from "@/common/constants/globalConstants";
import GridLayout from "@/components/GridLayout";

const id = 'EUlayoutArr';
const Common: React.FC<any> = (props: any) => {
  const { data } = props;
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (data.length) {
      let listData: any = [],
        layoutData: any = !!localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id) || "") : [];
      data.forEach((item: any, index: number) => {
        const imgList: any = Object.entries(item).filter((i: any) => !!i[1] && i[1].indexOf('http') > -1);
        if (!!imgList[0]) {
          listData = listData.concat(<div key={index + ''}>
            <img src={imgList[0][1]} alt="logo" />
            <div className="custom-drag" />
          </div>);
          if (layoutData.filter((i: any) => i.i == index).length === 0) {
            layoutData = layoutData.concat(Object.assign({}, { i: index + '' },
              !!layoutTransform[index] ? layoutTransform[index] : {
                x: 0, y: 24 + 12 * index, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32
              }))
          }
          console.log(layoutData)
        }
      });
      setList(listData);
      setLayout(layoutData);
    }
  }, [data]);

  return (
    <div className={`${styles.common} flex-box`}>
      {
        list.length ?
          <GridLayout id={id} list={list} layout={layout} />
          : null
      }
    </div>
  );
};

export default Common;
