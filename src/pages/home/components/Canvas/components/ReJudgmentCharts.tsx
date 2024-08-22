import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, message, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ImgCharts from './ImgCharts';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
};

const ReJudgmentCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [], fontSize,
    xName = '',
    fetchType,
  } = data;
  const [form] = Form.useForm();
  const domRef = useRef<any>();
  const searchRef = useRef<any>({ productCode: undefined, regionCode: undefined });
  const timeRef = useRef<any>(null);
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        status: 0,
        position: {
          leftTop: { "x": 0.3, "y": 0.2 },
          rightBottom: { "x": 0.35, "y": 0.25 },
        },
        title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11',
        url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
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
  const [selected, setSelected] = useState<any>(null);

  const options = useMemo(() => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 7; j++) {
        if (((i === 3) && ![0, 6].includes(j)) || ([1, 2].includes(i) && [0, 6].includes(j))) {
          arr.push({
            label: `${i + 1}-${j + 1}A`,
            value: `${i + 1}-${j + 1}A`,
          });
          arr.push({
            label: `${i + 1}-${j + 1}B`,
            value: `${i + 1}-${j + 1}B`,
          });
        } else {
          arr.push({
            label: `${i + 1}-${j + 1}`,
            value: `${i + 1}-${j + 1}`,
          });
        }
      }
    };
    return arr;
  }, []);
  // 默认选中第一个
  useEffect(() => {
    if (!selected && !!dataValue?.filter((i: any) => i.status === 0)?.[0]) {
      setSelected(dataValue?.filter((i: any) => i.status === 0)?.[0])
    }
  }, [dataValue]);
  // 条件查询
  const handleChange = (key: string, value: any) => {
    searchRef.current[key] = value;
    const values = Object.values(searchRef.current)?.filter(Boolean);
    if (values?.length === 2) {
      btnFetch(fetchType, xName, { type: 'search', data: searchRef.current }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
          setSelected(res.data);
        } else {
          message.error(res?.message || res?.msg || '后台服务异常，请重启服务');
        }
      });
    }
  }

  return (
    <div
      id={`echart-${id}`}
      ref={domRef}
      className={`flex-box ${styles.reJudgmentCharts}`}
      style={{ fontSize }}
    >
      <div className="flex-box-center re-judgment-left">
        <div className="flex-box re-judgment-left-table">
          {
            Array.from({ length: 4 }).map((i, index: number) => {
              let className = `re-judgment-left-table-th`;
              return <div className={`flex-box ${className}`} key={`${className}-${index}`}>
                {
                  Array.from({ length: 7 }).map((i, cIndex: number) => {
                    const title = `${index + 1}-${cIndex + 1}`;
                    return <div
                      className={`flex-box-center ${className}-td ${className}-${title}`}
                      key={`${className}-td-${cIndex}`}
                    >
                      {
                        (
                          ((index === 3) && ![0, 6].includes(cIndex))
                          ||
                          ([1, 2].includes(index) && [0, 6].includes(cIndex))
                        ) ?
                          <Fragment>
                            <div className={`flex-box-center re-judgment-left-table-top ${className}-${title}A`}>{`${title}A`}</div>
                            <div className={`flex-box-center re-judgment-left-table-bottom ${className}-${title}B`}>{`${title}B`}</div>
                          </Fragment>
                          : title
                      }
                    </div>
                  })
                }
              </div>
            })
          }
          {
            !!selected ?
              <div
                className="re-judgment-left-table-error"
                style={{
                  left: `${selected?.position?.leftTop?.x * 100}%`,
                  top: `${selected?.position?.leftTop?.y * 100}%`,
                  width: `${(selected?.position?.rightBottom?.x - selected?.position?.leftTop?.x) * 100}%`,
                  height: `${(selected?.position?.rightBottom?.y - selected?.position?.leftTop?.y) * 100}%`,
                }}
              />
              : null
          }
        </div>
      </div>
      <div className="flex-box re-judgment-right">
        <div className="re-judgment-right-img-list">
          {
            (dataValue || [])?.map((item: any, index: number) => {
              const { status, title, url, position } = item;
              if (status === 0) {
                return <div
                  className="re-judgment-right-img-list-item"
                  key={`re-judgment-right-img-list-item-${index}`}
                  onClick={() => {
                    // const tds = domRef.current.getElementsByClassName('re-judgment-left-table-th-td');
                    // const tds1 = domRef.current.getElementsByClassName('re-judgment-left-table-top');
                    // const tds2 = domRef.current.getElementsByClassName('re-judgment-left-table-bottom');
                    // tds.forEach((i: any) => {
                    //   i.style.border = '1px dashed #eee';
                    // });
                    // tds1.forEach((i: any) => {
                    //   i.style.border = 0;
                    //   i.style.borderBottom = '1px dashed #eee';
                    // });
                    // tds2.forEach((i: any) => {
                    //   i.style.border = 0;
                    //   i.style.borderTop = '1px dashed #eee';
                    // });
                    // const box = domRef.current.getElementsByClassName(`re-judgment-left-table-th-${position}`)?.[0];
                    // if (!!box) {
                    //   box.style.border = '1px solid #f00';
                    // }
                    setSelected(item);
                  }}
                >
                  <div className="flex-box-align-end re-judgment-right-img-list-item-status">NG</div>
                  <img src={url} alt={url} />
                  <div className='re-judgment-right-img-list-item-title'>{title}</div>
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
                onChange={(e) => {
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
                style={{ width: 200 }}
                onChange={(value) => handleChange('regionCode', value)}
                options={options}
              />
            </Form.Item>
          </Form>
          <div className="re-judgment-right-img-box-top">
            {
              !!selected ?
                <ImgCharts
                  id={`${id.split('$$')[0]}$$1$$alertImg`}
                  data={{
                    dataValue: selected?.url || undefined,
                    notLocalStorage: true,
                    comparison: false,
                    magnifier: true,
                    magnifierSize: 4,
                  }}
                />
                : null
            }
          </div>
          <div className="flex-box-center re-judgment-right-img-box-bottom">
            <Button icon={<CheckCircleOutlined />} className='OK' onClick={() => {
              btnFetch(fetchType, xName, { type: 'decide', data: true }).then((res: any) => {
                if (!!res && res.code === 'SUCCESS') {
                  message.success('success');
                  setSelected(null);
                } else {
                  message.error(res?.message || '后台服务异常，请重启服务');
                }
              });
            }}>复判OK</Button>
            <Button icon={<CloseCircleOutlined />} type="primary" danger onClick={() => {
              btnFetch(fetchType, xName, { type: 'decide', data: false }).then((res: any) => {
                if (!!res && res.code === 'SUCCESS') {
                  message.success('success');
                  setSelected(null);
                } else {
                  message.error(res?.message || '后台服务异常，请重启服务');
                }
              });
            }}>复判NG</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReJudgmentCharts;
