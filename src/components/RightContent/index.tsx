import { Space } from 'antd';
import { CompressOutlined, ExpandOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useModel, SelectLang } from 'umi';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { exitFullScreen, isFullscreenElement, requestFullScreen } from '@/utils/utils';
import enUS0 from 'antd/es/locale/en_US';
import lang_enUS0 from "@/locales/en-US";

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const [full, setFull] = useState(false);
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const onEscCancelFull = () => {
    setFull(false);
  };
  // useEffect(() => {
  //   window.addEventListener("resize", onEscCancelFull, false);

  //   return () => {
  //     window.removeEventListener("resize", onEscCancelFull, false);
  //   }
  // }, [])

  const isIframe = useMemo(() => {
    return window.location.href.indexOf('iframe') > -1;
  }, [window.location.href]);

  return (
    <Space className={className}>
      <SettingOutlined />
      <SelectLang
        className={styles.action}
        postLocalesData={(list: any) => {
          return list.filter((i: any) => ["en-US", "zh-CN", "zh-TW"].includes(i.lang)) || [];
        }}
      />
      {
        full ?
          <CompressOutlined
            onClick={() => {
              setFull(false);
              exitFullScreen();
            }}
          />
          :
          <ExpandOutlined
            onClick={() => {
              setFull(true);
              requestFullScreen(document.body);
            }}
          />
      }
    </Space>
  );
};

export default GlobalHeaderRight;
