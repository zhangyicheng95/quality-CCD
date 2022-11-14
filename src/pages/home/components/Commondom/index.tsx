import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";
import { layoutTransform } from "@/common/constants/globalConstants";
import GridLayout from "@/components/GridLayout";

const id = 'EUlayoutArr';
let timer: string | number | NodeJS.Timeout | null | undefined = null;
const Common: React.FC<any> = (props: any) => {
  const { data } = props;
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (data.length) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        let listData: any = [],
          layoutData: any = !!localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id) || "") : [];
        data.forEach((item: any, index: number) => {
          const imgList: any = Object.entries(item).filter((i: any) => !!i[1] && i[1].indexOf('http') > -1);
          if (!!imgList[0]) {
            // const img = new Image();
            // img.src = imgList[0][1];
            // img.onload = (res) => {
            //   const { width, height } = img;
            listData = listData.concat(<div key={index + ''} className="flex-box" style={{
              justifyContent: 'center', overflow: 'hidden', width: '100%', height: '100%'
            }}>
              <img
                src={imgList[0][1]} alt="logo"
                style={{ width: '100%', height: 'auto' }}
              // style={(width / height) < 1 ? { height: '100%', width: 'auto' } : { width: '100%', height: 'auto' }}
              />
              <div className="custom-drag" />
            </div>);
            if (layoutData.filter((i: any) => i.i == index + '').length === 0) {
              layoutData = layoutData.concat(Object.assign({}, { i: index + '' },
                !!layoutTransform[index] ? layoutTransform[index] : {
                  x: 0, y: 20 + 10 * index, w: 3, h: 10, minW: 2, maxW: 6, minH: 4, maxH: 32
                }));
            }
          };
          // }
          setTimeout(() => {
            setList(listData);
            setLayout(layoutData);
          }, 300);
        });
      }, 100);
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
