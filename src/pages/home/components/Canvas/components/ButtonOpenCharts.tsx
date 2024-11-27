import React, { } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, message } from 'antd';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ButtonOpenCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    fontSize = 14,
    yName = '按钮',
    defaultImg = '',
    valueColor = 'primary',
  } = data;

  return (
    <div id={`echart-${id}`} className={`${styles.buttonUploadCharts}`}>
      <Button
        type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
        style={Object.assign(
          { fontSize },
          { height: '100%', width: '100%' },
          !['primary', 'link', 'ghost'].includes(valueColor)
            ? { backgroundColor: valueColor, color: '#fff' }
            : {},
        )}
        onClick={() => {
          if (!!defaultImg) {
            window?.parent?.postMessage?.(
              { type: '__cmd__', name: '__cmd__', value: `explorer file:\\${defaultImg}` },
              localStorage.getItem('parentOrigin') || '',
            );
          } else {
            message.error('未设置相关路径');
          }
        }}
      >
        {yName || '按钮'}
      </Button>
    </div>
  );
};

export default ButtonOpenCharts;
