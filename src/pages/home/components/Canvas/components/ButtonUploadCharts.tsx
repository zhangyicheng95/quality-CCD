import React, { useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message } from 'antd';
import { btnFetch } from '@/services/api';
import FileManager from '@/components/FileManager';
import ChooseFileButton from '@/components/ChooseFileButton';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ButtonUploadCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    fontSize = 14,
    yName = '按钮',
    xName = '',
    fetchType,
    valueColor = 'primary',
    ifNeedAllow = false,
    des_bordered,
  } = data;
  const [selectAreaPathVisible, setSelectAreaPathVisible] = useState(false);

  return (
    <div id={`echart-${id}`} className={`${styles.buttonUploadCharts}`}>
      <ChooseFileButton
        name={yName}
        type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
        style={Object.assign(
          { fontSize },
          !['primary', 'link', 'ghost'].includes(valueColor)
            ? { backgroundColor: valueColor, color: '#fff' }
            : {},
        )}
        className={`${des_bordered ? 'text-break' : ''}`}
        onClick={() => {
          if (!!localStorage.getItem('parentOrigin')) {
            window?.parent?.postMessage?.(
              { type: 'openFile', name: yName },
              localStorage.getItem('parentOrigin') || '',
            );
          } else {
            setSelectAreaPathVisible(true);
          }
        }}
        onOk={(value: any) => {
          if (ifNeedAllow) {
            window?.parent?.postMessage?.(
              { type: '__cmd__', name: '__cmd__', value: `explorer file:\\${value}` },
              localStorage.getItem('parentOrigin') || '',
            );
          }
          if (!!fetchType && !!xName) {
            btnFetch(fetchType, xName, { data: value }).then((res: any) => {
              if (res && res.code === 'SUCCESS') {
                message.success('success');
                setSelectAreaPathVisible(false);
              } else {
                message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
              }
            });
          }
        }}
      >
        {yName}
      </ChooseFileButton>

      {
        // 选择运行轨迹
        selectAreaPathVisible ? (
          <FileManager
            onOk={(val: any) => {
              const { value } = val;
              btnFetch(fetchType, xName, { data: value }).then((res: any) => {
                if (res && res.code === 'SUCCESS') {
                  message.success('success');
                  setSelectAreaPathVisible(false);
                } else {
                  message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
                }
              });
            }}
            onCancel={() => {
              setSelectAreaPathVisible(false);
            }}
          />
        ) : null
      }
    </div>
  );
};

export default ButtonUploadCharts;
