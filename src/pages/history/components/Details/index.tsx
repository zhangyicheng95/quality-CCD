import React, { useEffect, } from "react";
import styles from "./index.module.less";
import { message, Form, Table, Button, DatePicker } from "antd";
import * as _ from "lodash";
import moment from "moment";
import PrimaryTitle from "@/components/PrimaryTitle";
import { useLocation, useHistory } from "react-router";

const HistoryDetail: React.FC<any> = (props: any) => {
  const history = useHistory();
  const { state = {} } = useLocation<any>();
  const { name } = state;
  useEffect(() => {
    if (!state || _.isEmpty(state)) {
      history.goBack();
    }
  }, [])

  return (
    <div className={`${styles.historyDetail} page-size`}>
      <PrimaryTitle title={name} />
      <div className="history-content-box">

      </div>
    </div>
  );
};

export default HistoryDetail;
