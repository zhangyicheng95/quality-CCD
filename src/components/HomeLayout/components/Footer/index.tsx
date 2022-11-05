import React, { useEffect, useState } from "react";
import styles from "./index.module.less";
import { } from "antd";
import _ from "lodash";

const Footer: React.FC<any> = (props: any) => {
  const { } = props;
  const [footerSelected, setFooterSelected] = useState('log');

  useEffect(() => {

  }, []);
  return (
    <div className={`${styles.footer} flex-box`}>
      <div className="btn-box flex-box">
        <div className={`btn flex-box ${footerSelected === 'log' ? 'selected' : ''}`} onClick={() => setFooterSelected('log')}>日志</div>
        <div className={`btn flex-box ${footerSelected === 'problem' ? 'selected' : ''}`} onClick={() => setFooterSelected('problem')} style={{ border: 0 }}>问题</div>
      </div>
      <div className="log-content"></div>
    </div>
  );
};

export default Footer;
