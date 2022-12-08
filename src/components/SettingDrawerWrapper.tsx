import { SettingDrawer } from '@ant-design/pro-layout';
import { connect } from 'umi';

const SettingDrawerWrapper: React.FC<any> = (props: any) => {
  console.log('SettingDrawerWrapper props', props);
  const { settings, setInitialState, dispatch } = props;
  return (
    <SettingDrawer
      disableUrlParams
      enableDarkTheme
      settings={settings}
      onSettingChange={(_settings) => {
        console.log(_settings);
        dispatch({
          type: 'index/ef1',
          payload: 123,
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
  console.log('state', state);
  return { ...state };
})(SettingDrawerWrapper);
