import { notification } from 'antd';

const openNotificationWithIcon = (props: any) => {
  const { level, node_name, nid, message, params } = props;
  const type = level === 'warning' ? 'warning' : 'error';
  if (params?.filterWarning) {
    if (type === 'warning') {
      return null;
    }
  };

  const title =
    level === 'error' ? '错误' : level === 'critical' ? '阻断挂起' : '告警';
  return notification[type]({
    message: title,
    description: (
      <div>
        <p style={{ marginBottom: 8 }}>
          错误节点：{`${node_name || ''}（${nid || ''}）`}
        </p>
        <p style={{ marginBottom: 0 }}>错误信息：{message || ''}</p>
      </div>
    ),
    duration: 6, //type === "critical" ? null : 5, // 自动关闭时间，null表示不关闭
  });
};

export default openNotificationWithIcon;
