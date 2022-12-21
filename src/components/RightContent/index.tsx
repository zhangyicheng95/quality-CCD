import { Space } from 'antd';
import { CompressOutlined, ExpandOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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
  useEffect(() => {
    window.addEventListener("resize", onEscCancelFull, false);

    return () => {
      window.removeEventListener("resize", onEscCancelFull, false);
    }
  }, [])

  const isIframe = useMemo(() => {
    return window.location.href.indexOf('iframe') > -1;
  }, [window.location.href]);

  return (
    <Space className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          {
            label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
            value: 'umi ui',
          },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
      // onSearch={value => {
      //   console.log('input', value);
      // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <SelectLang
        className={styles.action}
        postLocalesData={(list: any) => {
          return list.filter((i: any) => ["en-US", "zh-CN", "zh-TW"].includes(i.lang)) || [];
        }}
      />
      {
        isIframe ? null :
          <Fragment>
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
          </Fragment>
      }
    </Space>
  );
};

export default GlobalHeaderRight;
