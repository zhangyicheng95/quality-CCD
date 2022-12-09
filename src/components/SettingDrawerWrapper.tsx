import { getParams, updateParams } from '@/services/api';
import { SettingDrawer } from '@ant-design/pro-layout';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const SettingDrawerWrapper: React.FC = (props: any) => {
  const { settings, setInitialState, dispatch, themeStore } = props;
  const { theme } = themeStore;
  const [paramData, setParamData] = useState<any>({});
  // console.log('SettingDrawerWrapper', props)
  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history") || !localStorage.getItem("ipString")) return;
    getParams(localStorage.getItem("ipString") || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { contentData } = data;
        setParamData(data);
        if (!!contentData && !!contentData.theme) {
          dispatch({
            type: 'themeStore/themeAction',
            payload: contentData.theme,
          });
          setInitialState((preInitialState: any) => ({
            ...preInitialState,
            settings: Object.assign({}, settings, {
              navTheme: contentData.theme
            }),
          }));
        }
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);

  return (
    <SettingDrawer
      disableUrlParams
      enableDarkTheme
      settings={settings}
      onSettingChange={(_settings) => {
        const { navTheme } = _settings;
        dispatch({
          type: 'themeStore/themeAction',
          payload: navTheme,
        });
        setInitialState((preInitialState: any) => ({
          ...preInitialState,
          settings: _settings,
        }));
        if (!!paramData.id) {
          // 把主题色存到接口中
          updateParams({
            id: paramData.id,
            data: Object.assign({}, paramData, !!paramData.contentData ? {
              contentData: Object.assign({}, paramData.contentData, {
                theme: navTheme
              })
            } : {}),
          }).then((res: any) => {
            if (res && res.code === 'SUCCESS') {

            } else {
              message.error(res?.msg || '接口异常');
            }
          });
        }
      }}
    />
  );
};

export default connect((state: any) => {
  console.log(state)
  return { ...state };
})(SettingDrawerWrapper);
