import { LeftOutlined } from '@ant-design/icons';
import { Card } from 'antd';

export default function AppSubPanel(props: any) {
  const { title, children, back } = props;

  const back2AppList = () => {
    back?.();
  }

  return (
    <Card
      bordered={false}
      style={{ marginLeft: -24, boxShadow: 'none' }}
      bodyStyle={{ padding: 12 }}
      title={
        <div className='flex-box-justify-between'>
          <LeftOutlined onClick={back2AppList} />
          <p>{title}</p>
        </div>
      }
    >
      {children}
    </Card>
  )
}