import { updateParams } from '@/services/api';
import { SettingDrawer } from '@ant-design/pro-layout';
import { message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const themeList = [
  {
    key: '--multi-player-background-color',
    light: '#fff',
    dark: '#202735',
  },
  {
    key: '--multi-player-children-background-color',
    light: 'rgb(235, 234, 234)',
    dark: '#273142',
  }
]

const SettingDrawerWrapper: React.FC = (props: any) => {
  const { initialState, setInitialState, dispatch, } = props;
  const { params, settings } = initialState;
  const [paramData, setParamData] = useState<any>({});
  useEffect(() => {
    if (!_.isEmpty(params)) {
      const { contentData } = params;
      setParamData(params);
      if (!!contentData && !!contentData.theme) {
        themeList.forEach((theme) => {
          const { key, light, dark } = theme;
          document.documentElement.style.setProperty(key, contentData.theme === 'realDark' ? dark : light);
        });
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
    }
  }, [params]);

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
        themeList.forEach((theme) => {
          const { key, light, dark } = theme;
          document.documentElement.style.setProperty(key, navTheme === 'realDark' ? dark : light);
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
            } : {
              contentData: {
                theme: navTheme
              }
            }),
          }).then((res: any) => {
            if (res && res.code === 'SUCCESS') {

            } else {
              message.error(res?.msg || res?.message || '接口异常');
            }
          });
        };
      }}
    />
  );
};

export default connect((state: any) => {
  return {};
})(SettingDrawerWrapper);
