import React, { useState } from "react";
import {
  Decoration8,
  Decoration5,
  Decoration1,
} from "@jiaminghi/data-view-react";
// import ScreenTab from "@router/screen/components/ScreenTab";
import { Text1 } from "@gaopeng123/screen";
import { useClock } from "@gaopeng123/hooks";
import logo from "@/assets/title-logo.png";
import styles from "./index.module.less";
import usePolling from "@/hooks/usePolling";
import moment from "moment";
import { Button } from "antd";

const tabsColor = ["#1B7FF0", "rgba(10, 183, 239, .5)"];

const ScreenTitle: React.FC<any> = (props: any) => {
  const { title, onClick = null } = props;
  const { ymd, hms, week } = useClock();
  const [dateTimeStr, setDateTimeStr] = useState<string>('')

  usePolling(() => {
    const now = moment()
    setDateTimeStr(now.format('yyyy年MM月DD日 HH:mm:ss'))
  }, 500)

  const reload = () => {
    window.location.reload();
  };
  return (
    <div className={styles.topHeader}>
      <div className="left">
        <div className="date-time">{dateTimeStr}</div>
      </div>
      <div
        className="center-title"
        onClick={() => onClick && onClick()}
      >
        <Text1 duration={0.6} delay={0}>
          {title}
        </Text1>
      </div>
      <div className="right">
        <Button type="primary" onClick={() => { }}>启动</Button>
        <Button onClick={() => { }}>停止</Button>
      </div>
    </div>
  );
};

export default ScreenTitle;
