import { notification } from 'antd';

const openNotificationWithIcon = (payload: any) => {
  const type = payload?.level === 'WARNING' ? 'warning' : 'error';
  const title =
    payload?.level === 'ERROR' ? '错误' : payload?.level === 'CRITICAL' ? '阻断挂起' : '告警';
  notification[type]({
    message: title,
    description: (
      <div>
        <p style={{ marginBottom: 8 }}>
          错误节点：{`${payload?.node_name || ''}（${payload?.nid || ''}）`}
        </p>
        <p style={{ marginBottom: 0 }}>错误信息：{payload?.message || ''}</p>
      </div>
    ),
    duration: 6, //type === "CRITICAL" ? null : 5, // 自动关闭时间，null表示不关闭
  });
};

export default openNotificationWithIcon;
