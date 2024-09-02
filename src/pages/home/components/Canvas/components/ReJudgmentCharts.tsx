import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ImgCharts from './ImgCharts';
import { btnFetch } from '@/services/api';
import ChooseFileButton from '@/components/ChooseFileButton';
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
    ifOnShowTab,
  } = data;
  const [form] = Form.useForm();
  const domRef = useRef<any>();
  const leftTableDomRef = useRef<any>();
  const leftTableImgDomRef = useRef<any>();
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
  const [leftModelSelected, setLeftModelSelected] = useState<any>({});
  const [selected, setSelected] = useState<any>(null);

  // 拉取模板图列表
  useEffect(() => {
    if (!!localStorage.getItem(`rejudgment-${id}`)) {
      setLeftModelSelected(JSON.parse(localStorage.getItem(`rejudgment-${id}`) || "{}"));
    }
  }, []);
  // 取SN码
  useEffect(() => {
    const productValue = dataValue?.filter((i: any) => i.type === 'SN')?.[0]?.value || undefined;
    if (!!productValue) {
      form.setFieldsValue({
        productCode: productValue,
      });
      handleChange('productCode', productValue);
    }
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
  // 导入模板
  const uploadProps = {
    accept: '.json',
    showUploadList: false,
    multiple: false,
    beforeUpload(file: any) {
      const reader = new FileReader(); // 创建文件对象
      reader.readAsText(file); // 读取文件的内容/URL
      reader.onload = (res: any) => {
        const {
          target: { result },
        } = res;
        try {
          const params = JSON.parse(result);
          btnFetch(fetchType, xName, { type: 'upload', data: params }).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {
              setLeftModelSelected(params);
              localStorage.setItem(`rejudgment-${id}`, JSON.stringify(params));
              message.success('success');
            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
          });
        } catch (err) {
          message.error('json文件格式错误，请修改后上传。');
          console.error(err);
        }
      };
      return false;
    },
  };
  // 条件查询
  const handleChange = (key: string, value: any) => {
    searchRef.current[key] = value;
    if (!searchRef.current['productCode']) {
      return;
    }
    btnFetch(fetchType, xName, { type: 'search', data: searchRef.current }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        message.success('success');
        // if (_.isObject(res.data) && !_.isArray(res.data)) {
        //   setSelected(res.data);
        // } else if (_.isArray(res.data)) {
        //   setSelected(res.data?.[0]);
        // }
      } else {
        message.error(res?.message || res?.msg || '后台服务异常，请重启服务');
      }
    });
  };
  if (!ifOnShowTab) return null;
  return (
    <div
      id={`echart-${id}`}
      ref={domRef}
      className={`flex-box ${styles.reJudgmentCharts}`}
      style={{ fontSize }}
    >
      <div className="flex-box-center re-judgment-left" ref={leftTableDomRef}>
        <div className="flex-box re-judgment-left-table" ref={leftTableImgDomRef}>
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
        <div className="re-judgment-left-select">
          <Upload {...uploadProps}>
            <Button
              disabled={!started}
            // type="primary"
            >
              更换模板
            </Button>
          </Upload>
        </div>
      </div>
      <div className="flex-box re-judgment-right">
        <div className="re-judgment-right-img-list">
          {
            (dataValue || [])?.map((item: any, index: number) => {
              const { status, title, url } = item;
              if (status === 0) {
                return <div
                  className="re-judgment-right-img-list-item"
                  key={`re-judgment-right-img-list-item-${index}`}
                  onClick={() => {
                    setSelected(item);
                  }}
                >
                  <div className="flex-box-align-end re-judgment-right-img-list-item-status">NG</div>
                  <img src={url} alt={url} />
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
                style={{ width: 200 }}
                onChange={(value) => handleChange('regionCode', value)}
                options={Object.keys(leftModelSelected?.position || {})?.map((i: any) => ({ key: i, value: i }))}
              />
            </Form.Item>
            <Form.Item
              name={`productionLine`}
              label={'产线'}
              rules={[{ required: false, message: '产线' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                // mode="multiple"
                allowClear
                style={{ width: 200 }}
                onChange={(value) => handleChange('productionLine', value)}
                options={[
                  { label: '左工位', value: 'left' },
                  { label: '右工位', value: 'right' }
                ]}
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
                    ifOnShowTab: true
                  }}
                />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(ReJudgmentCharts);
