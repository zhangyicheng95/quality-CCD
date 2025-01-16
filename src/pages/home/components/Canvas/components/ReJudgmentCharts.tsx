import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Image, Input, message, notification, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ImgCharts from './ImgCharts';
import { btnFetch } from '@/services/api';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
};

const ReJudgmentCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue = [], fontSize,
    xName = '',
    fetchType,
  } = data;
  const [form] = Form.useForm();
  const domRef = useRef<any>();
  const leftTableDomRef = useRef<any>();
  const leftTableImgDomRef = useRef<any>();
  const searchRef = useRef<any>({ productCode: undefined, regionCode: undefined, productionLine: 'left' });
  const timeRef = useRef<any>(null);
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        status: 0,
        position: {
          leftTop: { "x": 0.3, "y": 0.2 },
          rightBottom: { "x": 0.35, "y": 0.25 },
        },
        flag: true,
        title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11',
        url: 'https://th.bing.com/th/id/R.8c519252dac30475433fa46314eb1647?rik=k3Y%2fYrn%2faCmwfA&pid=ImgRaw&r=0'
      },
      {
        status: 0,
        position: {
          leftTop: { "x": 0.35, "y": 0.25 },
          rightBottom: { "x": 0.63, "y": 0.62 },
        },
        title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11',
        url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
      },
      {
        status: 0,
        position: {
          leftTop: { "x": 0.35, "y": 0.25 },
          rightBottom: { "x": 0.53, "y": 0.52 },
        },
        title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11',
        url: 'https://th.bing.com/th/1id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
      },
      {
        status: 0,
        position: {
          leftTop: { "x": 0.35, "y": 0.25 },
          rightBottom: { "x": 0.45, "y": 0.45 },
        },
        title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11',
        url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
      },
    ];
  }
  const [leftModelSelected, setLeftModelSelected] = useState<any>({ position: {}, url: '' });
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (!started) return;
    setSelected(null);
    setLeftModelSelected({ position: {}, url: '' });
    dataValue = [
      {
        "type": "SN",
        "value": ""
      },
      {
        "type": "station",
        "value": ""
      },
      {
        "type": "model",
        "value": {}// model.json的内容
      },
      {
        "type": "lot_no", // 批次号
        "value": ""
      },
      {
        "type": "product_no", // 产品号
        "value": ""
      }
    ];
  }, [started]);
  useEffect(() => {
    // 取SN码
    const productValue = dataValue?.filter((i: any) => i.type === 'SN')?.[0]?.value;
    if (!_.isUndefined(productValue)) {
      setLeftModelSelected((prev: any) => {
        return {
          ...prev,
          OK: ''
        }
      });
      !!productValue && handleChange('productCode', productValue);
      form.setFieldsValue({
        productCode: productValue,
      });
    };
    // 取station码
    const stationValue = dataValue?.filter((i: any) => i.type === 'station')?.[0]?.value;
    if (!_.isUndefined(stationValue)) {
      const transform = {
        'left': '左工位',
        'right': '右工位'
      };
      form.setFieldsValue({
        productionLine: transform[stationValue],
      });
    };
    // 取lot_no批次号 
    const lotNoValue = dataValue?.filter((i: any) => i.type === 'lot_no')?.[0]?.value;
    if (!_.isUndefined(lotNoValue)) {
      form.setFieldsValue({
        lot_no: lotNoValue,
      });
    };
    // 取product_no产品号
    const productNoValue = dataValue?.filter((i: any) => i.type === 'product_no')?.[0]?.value;
    if (!_.isUndefined(productNoValue)) {
      form.setFieldsValue({
        product_no: productNoValue,
      });
    };
    // 取模版
    const modelValue = dataValue?.filter((i: any) => i.type === 'model')?.[0]?.value;
    if (!!modelValue && modelValue != 'undefined' && modelValue != 'null') {
      setLeftModelSelected(!!Object?.keys?.(modelValue)?.length ? modelValue : { position: {}, url: '' });
    };
    // 消息提示
    const messageValue = dataValue?.filter((i: any) => i.type === 'message')?.[0]?.value;
    if (!!messageValue) {
      notification.destroy();
      notification['warning']({
        message: '提示',
        description: messageValue
      });
    };
    // 查询为空消息提示
    const messageNoneValue = dataValue?.filter((i: any) => i.type === 'message-none')?.[0]?.value;
    if (!!messageNoneValue) {
      notification.destroy();
      notification['warning']({
        message: '提示',
        description: messageNoneValue,
      });
    };
    // 全是OK消息提示
    const messageOKValue = dataValue?.filter((i: any) => i.type === 'message-ok')?.[0]?.value;
    if (!!messageOKValue) {
      setLeftModelSelected((prev: any) => {
        return {
          ...prev,
          OK: messageOKValue
        }
      });
    };
  }, [dataValue]);
  // 选择的模板图，计算大小
  useEffect(() => {
    const boxWidth = leftTableDomRef.current?.clientWidth || 0;
    const boxHeight = (leftTableDomRef.current?.clientHeight * 0.8) || 0;
    let img: any = document.createElement('img');
    img.src = leftModelSelected?.url;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      if (width >= height) {
        // 横着的图
        leftTableImgDomRef.current.width = boxWidth;
        leftTableImgDomRef.current.height = (height / width) * boxWidth;
      } else {
        // 竖着的图
        leftTableImgDomRef.current.width = (width / height) * boxHeight;
        leftTableImgDomRef.current.height = boxHeight;
      }
    };
  }, [leftModelSelected?.url, leftTableDomRef.current?.clientWidth]);
  // 条件查询
  const handleChange = (key: string, value: any) => {
    setLeftModelSelected((prev: any) => {
      return {
        ...prev,
        OK: ''
      }
    });
    return new Promise((resolve: any, reject: any) => {
      searchRef.current[key] = value;
      btnFetch(fetchType, xName, { type: 'search', data: searchRef.current }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setSelected(null);
          message.success('success');
          setTimeout(() => {
            resolve(true);
          }, 200);
        } else {
          message.error(res?.message || res?.msg || '后台服务异常，请重启服务');
        }
      });
    });
  };

  return (
    <div
      id={`echart-${id}`}
      ref={domRef}
      className={`flex-box ${styles.reJudgmentCharts}`}
      style={{ fontSize }}
    >
      <div className="flex-box-center re-judgment-left" ref={leftTableDomRef}>
        {
          !!leftModelSelected.OK ? <div className='flex-box-center' style={{
            width: '100%',
            padding: 24,
            color: 'rgba(0,87,17,1)',
            fontSize: 24
          }}>{leftModelSelected.OK}</div> : null
        }
        <div
          className="flex-box re-judgment-left-table"
          ref={leftTableImgDomRef}
          style={
            !!leftModelSelected.OK ? { backgroundColor: 'rgba(0,200,0,0.4)' } : {}
          }
        >
          {
            !!leftModelSelected?.url ?
              <img
                src={`${leftModelSelected?.url?.indexOf('http') < 0 ? 'http://localhost:8866/file/' : ''}${leftModelSelected?.url}`}
                alt={leftModelSelected?.url}
                style={{ width: '100%', height: '100%' }}
              />
              : null
          }
          {
            (dataValue || [])?.map?.((item: any, index: number) => {
              const { status, position } = item;
              if (status === 0) {
                return <div
                  key={`re-judgment-right-img-list-item-${index}`}
                  className="re-judgment-left-table-error"
                  style={{
                    left: `${position?.leftTop?.x * 100}%`,
                    top: `${position?.leftTop?.y * 100}%`,
                    width: `${(position?.rightBottom?.x - position?.leftTop?.x) * 100}%`,
                    height: `${(position?.rightBottom?.y - position?.leftTop?.y) * 100}%`,
                  }}
                  onClick={() => {
                    setSelected(null);
                    setTimeout(() => {
                      setSelected(item);
                    }, 200);
                  }}
                />
              }
              return null;
            })
          }
          {
            !!selected ?
              <div
                className="re-judgment-left-table-error"
                style={{
                  background: 'rgba(0, 0, 200, 0.5)',
                  left: `${selected?.position?.leftTop?.x * 100}%`,
                  top: `${selected?.position?.leftTop?.y * 100}%`,
                  width: `${(selected?.position?.rightBottom?.x - selected?.position?.leftTop?.x) * 100}%`,
                  height: `${(selected?.position?.rightBottom?.y - selected?.position?.leftTop?.y) * 100}%`,
                }}
              />
              : null
          }
        </div>
        {
          !!leftModelSelected?.name ?
            <div className='flex-box-center' style={{
              width: '100%',
              padding: 24,
              fontSize: 24,
              fontWeight: 'bold'
            }}>当前型号：{leftModelSelected.name}</div>
            : null
        }
      </div>
      <div className="flex-box re-judgment-right">
        <div className="re-judgment-right-img-list">
          {
            (dataValue || [])?.map?.((item: any, index: number) => {
              const { status, title, url, flag } = item;
              if (status === 0) {
                return <div
                  className="re-judgment-right-img-list-item"
                  key={`re-judgment-right-img-list-item-${index}`}
                  onClick={() => {
                    setSelected(null);
                    setTimeout(() => {
                      setSelected(item);
                    }, 200);
                  }}
                >
                  <div className="flex-box-align-end re-judgment-right-img-list-item-status">NG</div>
                  {
                    !!flag ?
                      <div className="re-judgment-right-img-list-item-flag-title">
                        已复判
                      </div>
                      : null
                  }
                  <div className="re-judgment-right-img-list-item-img-box flex-box-center">
                    <img src={url} alt={url} />
                  </div>
                  <div
                    className='re-judgment-right-img-list-item-title'
                    style={selected?.url === url ? {
                      backgroundColor: 'rgba(255,0,0,.4)'
                    } : {}}
                  >{title}</div>
                </div>
              }
              return null;
            })
          }
        </div>
        <div className="re-judgment-right-img-box">
          <Form
            form={form} scrollToFirstError
            className='flex-box-center re-judgment-right-img-box-search'
          >
            <Form.Item
              name={`productCode`}
              label={'产品码'}
              rules={[{ required: false, message: '产品码' }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                allowClear
                style={{ width: 180 }}
                spellCheck="false"
                onPressEnter={(e: any) => {
                  if (!!timeRef.current) {
                    clearTimeout(timeRef.current);
                  }
                  timeRef.current = setTimeout(() => {
                    handleChange('productCode', e.target.value);
                  }, 300);
                }}
              />
            </Form.Item>
            <Form.Item
              name={`regionCode`}
              label={'区域编码'}
              rules={[{ required: false, message: '区域编码' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                // mode="multiple"
                allowClear
                style={{ minWidth: 80 }}
                onChange={(value) => handleChange('regionCode', value)}
                options={(Object.keys?.(leftModelSelected?.position || {}))?.map?.((i: any) => ({ key: i, value: i }))}
              />
            </Form.Item>
            <Form.Item
              name={`productionLine`}
              label={'工位'}
              rules={[{ required: false, message: '工位' }]}
              style={{ marginBottom: 0 }}
            >
              <Input spellCheck="false" disabled style={{ width: 80, color: '#000' }} />
            </Form.Item>
            <Form.Item
              name={`lot_no`}
              label={'批次号'}
              rules={[{ required: false, message: '批次号' }]}
              style={{ marginBottom: 0 }}
            >
              <Input spellCheck="false" disabled style={{ width: 80, color: '#000' }} />
            </Form.Item>
            <Form.Item
              name={`product_no`}
              label={'产品号'}
              rules={[{ required: false, message: '产品号' }]}
              style={{ marginBottom: 0 }}
            >
              <Input spellCheck="false" disabled style={{ width: 80, color: '#000' }} />
            </Form.Item>
          </Form>
          <div className="re-judgment-right-img-box-top">
            {
              !!selected ?
                <Fragment>
                  <ImgCharts
                    id={`${id.split('$$')[0]}$$1$$alertImg`}
                    data={{
                      dataValue: selected?.url || undefined,
                      notLocalStorage: true,
                      comparison: false,
                      magnifier: true,
                      magnifierSize: 12,
                    }}
                  />
                </Fragment>
                : null
            }
          </div>
          <div className="flex-box-center re-judgment-right-img-box-bottom">
            <Button
              icon={<CheckCircleOutlined />}
              className='OK'
              disabled={!selected}
              onClick={() => {
                btnFetch(fetchType, xName, { type: 'decide', data: { ...selected, value: true } }).then((res: any) => {
                  if (!!res && res.code === 'SUCCESS') {
                    message.success('success');
                    setSelected(null);
                  } else {
                    message.error(res?.message || '后台服务异常，请重启服务');
                  }
                });
              }}>复判OK</Button>
            <Button
              icon={<CloseCircleOutlined />}
              type="primary"
              disabled={!selected}
              danger
              onClick={() => {
                btnFetch(fetchType, xName, { type: 'decide', data: { ...selected, value: false } }).then((res: any) => {
                  if (!!res && res.code === 'SUCCESS') {
                    message.success('success');
                    setSelected(null);
                  } else {
                    message.error(res?.message || '后台服务异常，请重启服务');
                  }
                });
              }}>复判NG</Button>
            {
              !!selected ?
                <Button
                  type="primary"
                  onClick={() => {
                    setSelected((prev: any) => {
                      return {
                        ...prev,
                        url: prev?.url?.indexOf('NG') > -1 ? prev?.url?.replace('NG', 'ORIG') : prev?.url?.replace('ORIG', 'NG'),
                      }
                    })
                  }}
                >切换{selected?.url?.indexOf('NG') > -1 ? '原图' : selected?.url?.indexOf('ORIG') > -1 ? '结果图' : ''}</Button>
                : null
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(ReJudgmentCharts);