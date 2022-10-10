import React, { useState } from "react";
import styles from "./index.module.less";
import { Button, Input, Select, Upload } from "antd";

const { Option } = Select;

const SecondTabs: React.FC<any> = (props: any) => {
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
    <div className={styles.secondTabs}>
      <Upload {...uploadProps}>
        <Button
          // type="primary"
          className="item-btn"
          style={{ marginRight: 8 }}
        >
          导入基本信息
        </Button>
      </Upload>
      <Input
        style={{ width: 200, marginRight: 8 }}
        placeholder="项目ID"
        defaultValue={ipString}
        disabled={!edit}
        onChange={(e) => {
          const { value } = e.target;
          setIpString(value);
        }}
      />
      {edit ? (
        <Button
          type="primary"
          className="item-btn"
          onClick={() => {
            localStorage.setItem("ipString", ipString);
            setEdit(false);
          }}
        >
          确定
        </Button>
      ) : (
        <Button
          type="primary"
          className="item-btn"
          onClick={() => {
            setEdit(true);
          }}
        >
          修改项目ID
        </Button>
      )}
      <Select
        placeholder="显示结果个数"
        style={{ width: 160 }}
        onChange={(value) => {
          setShowNum(value);
        }}
        defaultValue={showNum}
      >
        {showNumList.map((item) => {
          return (
            <Option key={item.num} value={item.num}>
              {item.title}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default SecondTabs;

const showNumList = [
  {
    title: "显示全部",
    num: "100",
  },
  {
    title: "显示一个结果区",
    num: "1",
  },
  {
    title: "显示二个结果区",
    num: "2",
  },
  {
    title: "显示四个结果区",
    num: "4",
  },
];
