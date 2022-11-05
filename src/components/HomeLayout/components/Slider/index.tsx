import React, { useState } from "react";
import styles from "./index.module.less";
import { message, } from "antd";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

const Slider: React.FC<any> = (props: any) => {
  const { } = props;

  return (
    <div className={styles.slider}>
      <div className="btn-box">
        <div className="flex-box btn start" onClick={() => message.success('任务启动成功')}>
          <PlayCircleOutlined className="btn-icon" />
          启动检测
        </div>
        <div className="flex-box btn end" onClick={() => message.success('任务停止成功')}>
          <PauseCircleOutlined className="btn-icon" />
          停止检测
        </div>
      </div>
      <div className="info-box">
        基本信息
      </div>
      <div className="message-box">
        实时message
      </div>
    </div>
  );
};

export default Slider;
