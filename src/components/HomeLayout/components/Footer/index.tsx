import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import moment from "moment";
import PanelTitle from "@/components/PanelTitle";
import _ from "lodash";

const Footer: React.FC<any> = (props: any) => {
  const { } = props;
  const [form] = Form.useForm();


  return (
    <div className={`${styles.footer} flex-box`}>
      <div className="btn-box">
        <div className="btn">日志</div>
        <div className="btn">问题</div>
      </div>
      <div className="log-content"></div>
    </div>
  );
};

export default Footer;
