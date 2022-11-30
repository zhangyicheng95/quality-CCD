import React from "react";
import styles from "./index.module.less";
import { Tabs } from "antd";
import _ from "lodash";
import Defect from "./components/Defect";
import Size from "./components/Size";

const TBJ: React.FC<any> = (props: any) => {
  const { setActiveTab, ...rest } = props;

  return (
    <div className={`${styles.tbj}`}>
      <Tabs
        defaultActiveKey="1"
        className="tbj-tabs"
        onChange={(val) => setActiveTab(val + '')}
        destroyInactiveTabPane={true}
        items={[
          {
            label: '尺寸测量',
            key: '1',
            children: <Size {...rest} />
          },
          {
            label: '缺陷检测',
            key: '2',
            children: <Defect {...rest} />
          },
        ]}
      />
    </div>
  );
};

export default TBJ;
