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
      { status: 0, position: '1-1', title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11', url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' },
      { status: 0, position: '1-3', title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11', url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' },
      { status: 1, position: '2-1A', title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11', url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' },
      { status: 0, position: '3-1B', title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11', url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' },
      { status: 0, position: '4-2A', title: 'BOTTOM.C8 BOTTOM.C9平面三伤1.1.11', url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0' }
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
      btnFetch('get', xName, searchRef.current).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
          setSelected(res.data);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
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
                    const tds = domRef.current.getElementsByClassName('re-judgment-left-table-th-td');
                    const tds1 = domRef.current.getElementsByClassName('re-judgment-left-table-top');
                    const tds2 = domRef.current.getElementsByClassName('re-judgment-left-table-bottom');
                    tds.forEach((i: any) => {
                      i.style.border = '1px dashed #eee';
                    });
                    tds1.forEach((i: any) => {
                      i.style.border = 0;
                      i.style.borderBottom = '1px dashed #eee';
                    });
                    tds2.forEach((i: any) => {
                      i.style.border = 0;
                      i.style.borderTop = '1px dashed #eee';
                    });
                    const box = domRef.current.getElementsByClassName(`re-judgment-left-table-th-${position}`)?.[0];
                    console.log(box, position);
                    if (!!box) {
                      box.style.border = '1px solid #f00';
                    }
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
              btnFetch(fetchType, xName, { data: 1 }).then((res: any) => {
                if (!!res && res.code === 'SUCCESS') {
                  message.success('success');
                  setSelected(null);
                } else {
                  message.error(res?.message || '后台服务异常，请重启服务');
                }
              });
            }}>复判OK</Button>
            <Button icon={<CloseCircleOutlined />} type="primary" danger onClick={() => {
              btnFetch(fetchType, xName, { data: 0 }).then((res: any) => {
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
