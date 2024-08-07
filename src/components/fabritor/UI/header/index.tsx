import { Layout } from 'antd';
import Toolbar from './Toolbar';
import Export from './Export';
import Logo from './Logo';
import BaseInfo from './BaseInfo';
import { CenterV } from '@/components/fabritor/components/Center';
import styles from './index.less';
import FileToolbar from './FileToolbar';

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  padding: 0,
  height: 50,
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #e8e8e8'
};

export default function () {
  return (
    <Header style={headerStyle} className={styles['fabritor-header']}>
      {/* <Logo /> */}
      <CenterV className={"fabritor-base-info"}>
        <FileToolbar />
        {/* <BaseInfo /> */}
        <Toolbar />
      </CenterV>
      <div style={{ width: 279 }} >
        {/* <Export /> */}
        {/* <FileToolbar /> */}
      </div>
    </Header>
  )
}