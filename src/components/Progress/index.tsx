import React, { useEffect, useRef, useMemo } from "react";
import styles from "./styles.module.less";

interface Props {
  title?: any;
  unit?: any;
  complete: number;
  total: number;
  style?: any;
}
const Progress: React.FC<Props> = (props: any) => {
  const { complete, total, title, unit, style } = props;
  const percent = useMemo(() => {
    return ((complete / total || 0) * 100).toFixed(0);
  }, [complete, total]);
  return (
    <div className={styles.progressBox} style={style}>
      <div className="top-progress-title"> {title || "当前拧紧进度"}:</div>
      <div className="top-progress-percent">
        <div
          className="left"
          style={{
            width: `${percent}%`
          }}
        >
          <span className="percent">{percent}%</span>
        </div>
      </div>

      <div className="top-progress-unit">
        {complete || 0} / {total || 0}
        {unit || "颗"}
      </div>
    </div>
  );
};

export default Progress;
