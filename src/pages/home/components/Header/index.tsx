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
import { ControlOutlined, FileTextOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { Option } = Select;
const Header: React.FC<any> = (props: any) => {
  const { onClick } = props;
  const { push } = useHistory();

  return (
    <div className={`${styles.header} flex-box`}>
      <div className="title" onClick={() => onClick && onClick()}>
        UBVision
      </div>
      <div className="btn-box flex-box">
        <div className="flex-box btn" onClick={() => push('home')}>
          <HomeOutlined />
          主页
        </div>
        <div className="flex-box btn" onClick={() => push('history')}>
          <FileTextOutlined />
          历史记录
        </div>
        <div className="flex-box btn" onClick={() => push('control')}>
          <ControlOutlined />
          参数控制
        </div>
      </div>
      <div className="setting">
        <div className="flex-box btn" onClick={() => push('setting')}>
          <SettingOutlined />
          设置
        </div>
      </div>
    </div>
  );
};

export default Header;

