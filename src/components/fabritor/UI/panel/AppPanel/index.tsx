import { Card } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useState } from 'react';

const APP_LIST = [
  {
    title: 'Emoji',
    key: 'emoji',
    icon: <SmileOutlined style={{ fontSize: 30 }} />
  }
];

export default function AppPanel() {
  const [app, setApp] = useState('');

  const handleAppClick = (item: any) => {
    setApp(item.key);
  }

  const back2List = () => { setApp(''); }

  const renderAppList = () => {
    return (
      <div
        className='flex-box-justify-around'
        style={{ flexWrap: 'wrap', gap: 12, padding: '16px 16px 16px 0', marginLeft: -8 }}
      >
        {
          APP_LIST.map(item => (
            <Card
              hoverable
              style={{ width: 120, paddingTop: 12 }}
              key={item.key}
              cover={item.icon}
              bodyStyle={{ padding: 12 }}
              onClick={() => { handleAppClick(item) }}
            >
              <Card.Meta description={item.title} style={{ textAlign: 'center' }} />
            </Card>
          ))
        }
      </div>
    )
  }

  const renderApp = () => {
    // if (app === 'emoji') {
    //   return <EmojiPanel back={back2List} />
    // }
    return null;
  }

  return (
    <div>
      {renderAppList()}
      {/* {
        app ? renderApp() : renderAppList()
      } */}
    </div>
  )
}