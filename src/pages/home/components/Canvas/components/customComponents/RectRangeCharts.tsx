import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Form, message } from 'antd';
import { btnFetch } from '@/services/api';
import SegmentSwitch from '@/components/SegmentSwitch';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const rectList = [
  { label: '左上角', value: 'leftTop' },
  { label: '上边', value: 'top' },
  { label: '右上角', value: 'rightTop' },
  { label: '左边', value: 'left' },
  { label: '中间', value: '' },
  { label: '右边', value: 'right' },
  { label: '左下角', value: 'bottomLeft' },
  { label: '下边', value: 'bottom' },
  { label: '右下角', value: 'rightBottom' },
];
const RectRangeCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let { dataValue, fontSize = 14, fetchType, xName } = data;
  const [form] = Form.useForm();
  const dom = useRef<any>(null);

  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    if (!!xName && started) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setTimeout(() => {
            setDataSource(res?.data || []);
            form.setFieldsValue(
              Object.entries(res?.data || {})?.reduce((pre: any, cen: any) => {
                return {
                  ...pre,
                  [`disabled-${cen[0]}`]: !!cen[1]?.disabled,
                };
              }, {}),
            );
          }, 500);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, [started]);

  useEffect(() => {
    if (!_.isEmpty(dataValue)) {
      setDataSource((prev: any) => {
        return Object.entries(prev)?.reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [cen[0]]: {
              ...cen[1],
              status: dataValue[cen[0]].status || '',
            },
          };
        }, {});
      });
    }
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} ref={dom} className={`${styles.rectRangeCharts}`} style={{ fontSize }}>
      <Form form={form} scrollToFirstError className="rect-range-box">
        {(rectList || [])?.map((item: any, index: number) => {
          const { value } = item;
          const disabled = !!dataSource[value]?.disabled;
          const status = dataSource[value]?.status;
          return (
            <div
              className={`flex-box-center rect-range-box-item ${_.lowerCase(status)}`}
              key={`rect-range-box-item-${index}`}
              style={Object.assign(
                {},
                index % 3 === 1 ? { width: 'calc(50% - 16px)', margin: '0 8px' } : {},
                [3, 5].includes(index) ? { height: 'calc(50% - 16px)', margin: '8px 0' } : {},
                !value ? { backgroundColor: 'transparent' } : {},
              )}
              onClick={() => {
                if (!fetchType || !xName || !value) return;
                const result = {
                  ...dataSource,
                  [value]: { ...dataSource[value], disabled: !disabled },
                };
                const params = Object.entries(result).reduce((pre: any, cen: any) => {
                  return {
                    ...pre,
                    [cen[0]]: { disabled: cen[1]?.disabled || false },
                  };
                }, {});
                btnFetch(fetchType, xName, params).then((res: any) => {
                  if (res && res.code === 'SUCCESS') {
                    message.success('上传成功');
                    setDataSource(result);
                    form.setFieldsValue({ [`disabled-${value}`]: !disabled });
                  } else {
                    message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
                    form.setFieldsValue({ [`disabled-${value}`]: disabled });
                  }
                });
              }}
            >
              {!value ? null : (
                <Form.Item
                  name={`disabled-${value}`}
                  label={''}
                  style={{ height: '50%', width: '50%', marginBottom: 0 }}
                >
                  <SegmentSwitch
                    fontInBody={[
                      { label: '', value: false, backgroundColor: 'grey' },
                      {
                        label: '',
                        value: true,
                        backgroundColor: 'rgba(24, 144, 255, 1)',
                      },
                    ]}
                  />
                </Form.Item>
              )}
            </div>
          );
        })}
      </Form>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(RectRangeCharts);
