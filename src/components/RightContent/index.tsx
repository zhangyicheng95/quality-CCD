import { Space } from 'antd';
import { CompressOutlined, ExpandOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useModel, SelectLang } from 'umi';
import styles from './index.less';
import { exitFullScreen, isFullscreenElement, requestFullScreen } from '@/utils/utils';

const { version } = require('../../../package.json');
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
    setFull(isFullscreenElement());
  };
  useEffect(() => {
    window.addEventListener("resize", onEscCancelFull, false);

    return () => {
      window.removeEventListener("resize", onEscCancelFull, false);
    }
  }, [])

  return (
    <Space className={className}>
      <span style={{ marginRight: 8 }}>v{version}</span>
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
