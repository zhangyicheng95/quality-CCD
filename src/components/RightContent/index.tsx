import { Space } from 'antd';
import { CompressOutlined, ExpandOutlined, SettingOutlined, ClearOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useModel, SelectLang } from 'umi';
import styles from './index.less';
import { exitFullScreen, getAllLocalStorageKeys, isFullscreenElement, requestFullScreen } from '@/utils/utils';
import Avatar from './AvatarDropdown';
import { addStorageService, getStorageService } from '@/services/api';

const { version } = require('../../../package.json');
export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const [full, setFull] = useState(false);
  const { initialState } = useModel<any>('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { params, settings } = initialState;
  const { navTheme, layout } = settings;
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
  }, []);

  return (
    <Space className={className}>
      <span className='version'>v{version}</span>
      <Avatar menu={false} />
      <ClearOutlined style={{ marginRight: 12 }} onClick={() => {
        getStorageService(params.id).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            addStorageService(params.id, { ...res.data, localGridContentList: [] }).then((res: any) => {
              if (res && res.code === 'SUCCESS') {
                window.location.reload();
              }
            });
          }
        });
      }} />
      <SettingOutlined />
      <SelectLang
        className={styles.action}
        postLocalesData={(list: any) => {
          return list.filter((i: any) => ["en-US", "zh-CN", "zh-TW"].includes(i.lang)) || [];
        }}
      />
      {
        window.location.hash?.indexOf('&id=') > -1 ?
          <div className="full-screen-box"></div>
          :
          full ?
            <CompressOutlined
              onClick={() => {
                setFull(false);
                exitFullScreen();
              }}
            />
            :
            <ExpandOutlined
              id="full-screen-icon"
              onClick={() => {
                setFull(true);
                requestFullScreen();
              }}
            />
      }
    </Space>
  );
};

export default GlobalHeaderRight;
