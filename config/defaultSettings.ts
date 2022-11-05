import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "dark",
  "primaryColor": "#1890ff",
  "layout": "top",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "pwa": false,
  "headerHeight": 80,
  "splitMenus": false,
  "footerRender": false
};

export default Settings;
