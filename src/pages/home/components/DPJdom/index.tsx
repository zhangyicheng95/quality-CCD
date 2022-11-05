import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import _ from "lodash";
import GridLayout from "@/components/GridLayout";

const layoutTransform = {
  0: { x: 0, y: 0, w: 6, h: 24, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  1: { x: 6, y: 0, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  2: { x: 8, y: 12, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  3: { x: 10, y: 0, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  4: { x: 6, y: 12, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  5: { x: 8, y: 0, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 },
  6: { x: 10, y: 12, w: 2, h: 12, minW: 2, maxW: 6, minH: 4, maxH: 32 }
}
const DPJ: React.FC<any> = (props: any) => {
  const data = [{ img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fseopic.699pic.com%2Fphoto%2F40015%2F5662.jpg_wh1200.jpg&refer=http%3A%2F%2Fseopic.699pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670048199&t=5f1ef676d4ee5a0ccf46a23156232a09' }, {}, {}, {}, {}, {}, {}]
  const [list, setList] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (data.length) {
      let listData: any = [],
        layoutData: any = [];
      data.forEach((item, index) => {
        listData = listData.concat(<div key={index + ''}>
          <img src={item.img} alt="logo" />
          <div className="custom-drag" />
        </div>);
        layoutData = layoutData.concat({
          i: index + '', ...layoutTransform[index],
        })
      });
      console.log(layoutData)
      setList(listData);
      setLayout(localStorage.getItem("EUlayoutArr") ? JSON.parse(localStorage.getItem("EUlayoutArr") || "[]") : layoutData);
    }
  }, []);

  return (
    <div className={`${styles.dpj} flex-box`}>
      <GridLayout list={list} layout={layout} setLayout={setLayout} />
    </div>
  );
};

export default DPJ;
