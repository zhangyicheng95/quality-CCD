import React, { useEffect } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, Col, Form, Input, InputNumber, message, Row } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import ChooseFileButton from '@/components/ChooseFileButton';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const FastFunctionCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const { titleFontSize = 24, fontSize = 24, fetchType, xName } = data;
  const [form] = Form.useForm();

  useEffect(() => {}, []);
  const onChange = (val: any) => {
    btnFetch(fetchType, xName, { type: 'fastFun', value: val }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.fastFunctionCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="便捷功能" style={{ fontSize }} titleFontSize={titleFontSize}>
        <div className="fast-function-box">
          {[
            { title: '机械手取消', type: '1', color: 'success' },
            { title: '启动皮带', type: '2', color: '' },
            { title: '回归原位', type: '3', color: '' },
            { title: '料盒清零回原位', type: '4', color: '' },
            { title: '停止皮带', type: '5', color: '' },
            { title: '缓存清零', type: '6', color: '' },
            { title: '理论片数清空', type: '7', color: '' },
            { title: '上料停止', type: '8', color: 'warning' },
            { title: '维修模式', type: '9', color: '' },
          ]?.map?.((item: any) => {
            const { title, type, color } = item;
            return (
              <Button
                key={`fast-function-box-btn-${type}`}
                className={color}
                type={!!color ? 'default' : 'primary'}
                onClick={() => onChange(type)}
              >
                {title}
              </Button>
            );
          })}
        </div>
      </CustomWindowBody>
    </div>
  );
};

export default FastFunctionCharts;
