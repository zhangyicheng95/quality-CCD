import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./index.module.less";
import { Image, Form, Input, Row, Select } from "antd";
import { isString, toUpper } from "lodash-es";
import _ from "lodash";
import { ControlOutlined, FileTextOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";

const { Option } = Select;
const Header: React.FC<any> = (props: any) => {
  const { onClick } = props;
  const { push } = useHistory();
  const { pathname } = useLocation();

  return (
    <div className={`${styles.header} flex-box`}>
      <div className="title" onClick={() => onClick && onClick()}>
        UBVision
      </div>
      <div className="btn-box flex-box">
        {
          routes.map((route: any, index: number) => {
            const { title, path, icon } = route;
            return <div className="flex-box btn" key={path}
              style={pathname === `/${path}` ? { background: 'rgba(68, 68, 84, 0.8)' } : {}}
              onClick={() => push(path)}
            >
              {icon}
              {title}
            </div>
          })
        }
      </div>
      <div className="setting">
        <div className="flex-box btn" onClick={() => push('setting')}>
          <SettingOutlined />
          设置
        </div>
      </div>
    </div>
  );
};

export default Header;

const routes = [
  {
    title: '主页',
    icon: <HomeOutlined />,
    path: 'home'
  },
  {
    title: '历史记录',
    icon: <FileTextOutlined />,
    path: 'history'
  },
  {
    title: '参数控制',
    icon: <ControlOutlined />,
    path: 'control'
  }
];