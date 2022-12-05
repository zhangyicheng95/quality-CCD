/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:03
 * @description: answer
 */
import React from "react";
import { notification } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";

const HomeLayout: React.FC<any> = (props) => {
  const { children } = props;


  return (
    <div className={styles.reportWrap}>
      {/* <Header /> */}
      <div className="box flex-box">
        <div className="content-box">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;

// 告警提示框
const openNotificationWithIcon = (item: any) => {
  const { type = "", title = "", content = "" } = item;
  notification[type === "WARNING" ? "warning" : "error"]({
    message: title,
    description: content,
    // maxCount: 5, // 最大显示数, 超过限制时，最早的消息会被自动关闭
    duration: type === "CRITICAL" ? null : 5, // 自动关闭时间，null表示不关闭
  });
};
