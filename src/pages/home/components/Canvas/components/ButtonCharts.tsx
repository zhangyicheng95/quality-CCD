import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, message, Modal } from 'antd';
import { btnFetch } from '@/services/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ButtonCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    dataValue = {},
    fontSize = 14,
    yName = '按钮',
    xName = '',
    fetchType,
    ifNeedAllow,
    valueColor = 'primary',
    des_bordered,
    fetchParams,
    line_height = 0
  } = data;
  const [locked, setLocked] = useState(0);

  useEffect(() => {
    if (dataValue?.action == 1) {
      setLocked(0);
    } else if (dataValue?.action == 0) {
      setLocked(line_height);
    };
  }, [line_height, dataValue?.action]);

  return (
    <div id={`echart-${id}`} className={`${styles.buttonCharts} flex-box`}>
      <Button
        disabled={!!line_height && (locked >= line_height)}
        type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
        style={Object.assign(
          { fontSize },
          { height: '100%', width: '100%' },
          !['primary', 'link', 'ghost'].includes(valueColor)
            ? { backgroundColor: valueColor, color: '#fff' }
            : {},
        )}
        className={`${des_bordered ? 'text-break' : ''}`}
        onClick={() => {
          const func = () => {
            let params = undefined;
            if (
              !_.isUndefined(fetchParams) &&
              !_.isNull(fetchParams) &&
              _.isString(fetchParams) &&
              !!fetchParams
            ) {
              try {
                params = JSON.parse(fetchParams);
              } catch (e) {
                console.log('按钮传递参数格式不对:', e);
                params = undefined;
              }
            }
            btnFetch(fetchType, xName, params).then((res: any) => {
              if (!!res && res.code === 'SUCCESS') {
                if (!!line_height) {
                  setLocked(pre => pre + 1);
                }
                message.success('success');
              } else {
                message.error(res?.message || '后台服务异常，请重启服务');
              }
            });
          };
          if (ifNeedAllow) {
            Modal.confirm({
              title: '提示',
              icon: <ExclamationCircleOutlined />,
              content: '确认发送？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                func();
              },
            });
          } else {
            func();
          }
        }}
      >
        {yName || '按钮'}
      </Button>
    </div>
  );
};

export default ButtonCharts;
