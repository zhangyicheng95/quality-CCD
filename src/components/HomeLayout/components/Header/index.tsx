import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./index.module.less";
import { Image, Form, Input, Row, Select } from "antd";
import { isString, toUpper } from "lodash";
import _ from "lodash";
import { ControlOutlined, FileTextOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import icon from '@/access/icon.svg'

const { Option } = Select;
const Header: React.FC<any> = (props: any) => {
  const { onClick } = props;
  const { push } = useHistory();
  const { pathname } = useLocation();

  return (
    <div className={`${styles.header} flex-box`}>
      <div className="flex-box title" onClick={() => onClick && onClick()}>
        <img src={icon} alt="logo" className="title-logo" />
        UBVision
      </div>
      <div className="btn-box flex-box">
        {
          routes.map((route: any, index: number) => {
            const { title, path, icon } = route;
            return <div className="flex-box btn" key={path}
              style={pathname === `/${path}` ? { background: 'rgb(29,121,255)' } : {}}
              onClick={() => push(path)}
            >
              {icon}
              {title}
            </div>
          })
        }
      </div>
      <div className="setting">
        <div className="flex-box btn"
          onClick={() => push('setting')}
          style={pathname === `/setting` ? { background: 'rgb(29,121,255)' } : {}}
        >
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