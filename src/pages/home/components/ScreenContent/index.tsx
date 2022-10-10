import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./index.module.less";
import { Image, Form, Input, Row, Select } from "antd";
import Charts from "@/components/Charts";
import {
  lineChartDefectOption,
  barChartDefectOption,
} from "@/components/Charts/echartsConfig";
import { isString, toUpper } from "lodash-es";
import _ from "lodash";

const { Option } = Select;
const ScreenContent: React.FC<any> = (props: any) => {
  const { showNum, data = [], footerData } = props;
  const [footer, setFooter] = useState<Array<any>>([]);
  const [contentList, setContentList] = useState<any>([]);

  useLayoutEffect(() => {
    setContentList(data.slice(0, showNum));
    setFooter([
      "相机1采集中",
      "相机2采集中",
      "相机3采集中",
      "相机4采集中",
      "设备停止中",
      "设备PLC连接成功",
      "磁盘剩余空间93.19%",
    ]);
  }, [data, showNum]);

  return (
    <div className={styles.screenContent}>
      <div className="screen-content-body">
        {(contentList || []).map(
          (item: any, index: number) => {
            console.log(item)
            return (
              <ContentItem
                contentList={contentList}
                item={item}
                index={index}
                showNum={showNum}
                key={item.uid}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default ScreenContent;

const resultType: any = {
  "1": "面尺寸",
  "2": "面错位",
  "3": "面缺陷",
  "": null,
};

const ContentItem = (props: any) => {
  const { contentList, item, index, showNum } = props;
  const [showPic, setShowPic] = useState("");
  const { type } = item;
  const title = item.nid; //item.title + resultType[type] || "";
  const imgList = Object.entries(item).filter((res: any) => {
    return isString(res[1]) ? res[1].indexOf("http") > -1 : false;
  });
  useEffect(() => {
    if (_.isArray(imgList) && !_.isUndefined(imgList[0])) {
      setShowPic(imgList[0][0]);
    }
  }, [imgList]);

  return (
    <div
      key={item.uid}
      className="body-item"
      style={Object.assign(
        (index + 1) === contentList.length || index % 2 === 1
          ? { borderRight: 0 }
          : {},
        (index + 1) === contentList.length ? { borderBottom: 0 } : {},
        contentList.length <= 2 ? { height: '100%' } : {},
        contentList.length <= 4 ? { minWidth: '50%' } : { minWidth: '33.3%' },
      )}
    >
      <div className="pic-title-select">
        {imgList.length ? (
          <Select
            size="small"
            style={{ width: "100%" }}
            onChange={(value: any) => {
              setShowPic(value);
            }}
            defaultValue={(_.isArray(imgList) && !_.isUndefined(imgList[0])) ? imgList[0][0] : undefined}
          >
            {(imgList || []).map((picItem: any, picIndex: number) => {
              return (
                <Option key={picItem[0]} value={picItem[0]}>
                  展示{picItem[0]}图
                </Option>
              );
            })}
          </Select>
        ) : null}
      </div>
      <div className="pic-title">{title}</div>
      <div className="pic-box">
        <Image src={`${item[showPic]}?time=${new Date().getTime()}`} alt="图片" />
      </div>
      {/* <div className="pic-title">{`${title}趋势图`}</div> */}
      {/* <div className="chart-box">
        {type === "3" ? (
          <Charts option={barChartDefectOption(item.chartData)} />
        ) : (
          <Charts option={lineChartDefectOption(item.chartData)} />
        )}
      </div> */}
    </div>
  );
};
