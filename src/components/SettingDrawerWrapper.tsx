import { SettingDrawer } from '@ant-design/pro-layout';
import { connect } from 'umi';

const SettingDrawerWrapper: React.FC = (props: any) => {
  const { settings, setInitialState, dispatch, themeStore } = props;
  const { theme } = themeStore;
  console.log(theme)
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
      }}
    />
  );
};

export default connect((state: any) => {
  console.log(state)
  return { ...state };
})(SettingDrawerWrapper);
