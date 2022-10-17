import React, { useState } from "react";
import styles from "./index.module.less";
import { Button, Input, Select, Upload } from "antd";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const Slider: React.FC<any> = (props: any) => {
  const { setLeftInfo, showNum, setShowNum, ipString, setIpString } = props;
  const [edit, setEdit] = useState(false);

  //上传基本信息
  const uploadProps = {
    accept: ".json",
    showUploadList: false,
    beforeUpload(file: any) {
      const reader = new FileReader(); // 创建文件对象
      reader.readAsText(file); // 读取文件的内容/URL
      reader.onload = (res: any) => {
        const {
          target: { result },
        } = res;
        try {
          setLeftInfo(JSON.parse(result));
        } catch (err) {
          console.log(err);
        }
      };
      return false;
    },
  };
  return (
    <div className={styles.sider}>
      <div className="btn-box">
        <div className="flex-box btn">
          <PlayCircleOutlined />
          启动
        </div>
        <div className="flex-box btn">
          <PauseCircleOutlined />
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
