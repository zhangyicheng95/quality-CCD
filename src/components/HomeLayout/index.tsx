import React from "react";
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
