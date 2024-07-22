import { Layout } from 'antd';
import Toolbar from './Toolbar';
import Export from './Export';
import Logo from './Logo';
import BaseInfo from './BaseInfo';
import { CenterV } from '@/components/fabritor/components/Center';
import styles from './index.less';

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
      <Logo />
      <CenterV
        style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <BaseInfo />
        <Toolbar />
      </CenterV>
      <Export />
    </Header>
  )
}