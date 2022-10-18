import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import _ from "lodash";

const Control: React.FC<any> = (props: any) => {
  const { errorData, leftInfo, data = {} } = props;

  return (
    <div className={`${styles.control} flex-box`}>
      control
    </div>
  );
};

export default Control;
