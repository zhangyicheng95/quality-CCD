import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import BasicTable from '@/components/BasicTable';
import { Button, Form, message } from 'antd';
import _ from 'lodash';
import styles from '../index.module.less';
import { btnFetch } from '@/services/api';
import { FormatWidgetToDom } from './Operation2Charts';
import moment from 'moment';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
const localData = {
  data: [
    {
      name: '结果',
      value: [
        { value: 1, color: 'red' },
        { value: 'OK' },
        { value: 1 },
        { value: 1 },
        { value: 1 },
        { value: 1 },
        { value: 1 },
        { value: 1 },
        { value: 1 },
      ],
    },
    {
      name: '生产号',
      value: [
        { value: '2882381' },
        { value: '2882383' },
        { value: '2882384' },
        { value: '2882387' },
        { value: '2882389' },
        { value: '2882392' },
        { value: '2882394' },
        { value: '2882396' },
        { value: '2882399' },
      ],
    },
    {
      name: '点位名称',
      value: [
        { value: '前门音响' },
        { value: '左前门把手' },
        { value: '后门' },
        { value: '前门音响' },
        { value: '左前门把手' },
        { value: '前门音响' },
        { value: '后门' },
        { value: '左前门把手' },
        { value: '后门' },
      ],
    },
    {
      name: '检测时间',
      value: [
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 1 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 30 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 2 * 52 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 3 * 51 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 4 * 51 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 5 * 51 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 6 * 53 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 7 * 54 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          value: moment(
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 8 * 50 * 60 * 1000),
          ).format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    },
    {
      name: '缺陷类型',
      value: [
        { value: '错装' },
        { value: '配合不良' },
        { value: '配合不良' },
        { value: '错装' },
        { value: '配合不良' },
        { value: '错装' },
        { value: '配合不良' },
        { value: '配合不良' },
        { value: '错装' },
      ],
    },
  ],
  total: 100
};
const Table5Charts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue,
    fontSize,
    des_bordered,
    fetchType,
    xName,
    valueColor = 'value',
    line_height = 28,
    timeSelectDefault,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData;
  };
  const [form] = Form.useForm();
  const domRef = useRef<any>(null);
  const pageRef = useRef({ page: 1, pageSize: 20 });
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    if (!_.isArray(dataValue?.data)) {
      message.error('分页表格组件数据格式不正确，请检查');
      return;
    };
    const keys = (dataValue?.data || [])
      ?.reduce((pre: any, cen: any) => {
        const { name } = cen;
        return Object.assign({}, pre, { [name]: '' });
      }, {});

    let list: any = [];
    (dataValue?.data || [])?.forEach((item: any) => {
      const { name, value } = item;
      (value || [])?.forEach((valueItem: any, index: number) => {
        if (!!list[index]) {
          list[index] = {
            ...list[index],
            [name]: valueItem || ''
          };
        } else {
          list[index] = {
            id: guid(),
            ...keys,
            [name]: valueItem || '',
          };
        }
      });
    });

    setDataSource(list);
  }, [dataValue?.data]);
  const columns = useMemo(() => {
    return dataValue?.data?.map((item: any) => {
      const { name, value } = item;
      return {
        title: name,
        dataIndex: name,
        key: name,
        align: 'center',
        width: `${fontSize * name?.length + 32}px`,
        render: (text: any, record: any) => {
          if (!!text && !!Object?.keys?.(text)?.length) {
            return <div style={Object.assign({ lineHeight: `${line_height}px`, padding: '0 4px' }, !!text?.color ?
              valueColor === 'value' ? { color: text?.color } : { backgroundColor: text?.color, color: '#eee' }
              : {})}>{text?.value}</div>
          } else {
            return text;
          }
        }
      };
    });
  }, [dataValue?.data]);
  const onSubmit = (params: any) => {
    form.validateFields().then((values) => {
      const valueFormat = Object.entries(values)?.reduce((pre: any, cen: any) => {
        if (cen[0]?.indexOf('RangePicker') > -1) {
          return {
            ...pre,
            [cen[0]?.split('$%$')?.[0]]: [cen?.[1]?.[0].format('YYYY-MM-DD HH:mm:ss'), cen?.[1]?.[1].format('YYYY-MM-DD HH:mm:ss')],
          };
        } else if (cen[0]?.indexOf('DatePicker') > -1) {
          return {
            ...pre,
            [cen[0]?.split('$%$')?.[0]]: cen?.[1].format('YYYY-MM-DD HH:mm:ss'),
          };
        } else {
          return {
            ...pre,
            [cen[0]?.split('$%$')?.[0]]: cen[1],
          };
        };
      }, {});
      btnFetch(fetchType, xName, { ...valueFormat, ...params }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('success');
        } else {
          message.error(
            res?.msg || res?.message || '后台服务异常，请重启服务',
          );
        }
      });
    });
  }
  return (
    <div id={`echart-${id}`} className={`${styles.table5Charts}`} ref={domRef} style={{ fontSize }}>
      <div className="flex-box-column table5-charts-search">
        <Form form={form} scrollToFirstError>
          {useMemo(() => {
            return _.isArray(timeSelectDefault) ?
              (timeSelectDefault || [])
                ?.sort((a: any, b: any) => a.sort - b.sort)
                ?.map((item: any, index: number) => {
                  const { name, alias, sort = 0, type, className, parent, disabled = false, require = false } = item;
                  if (!!parent) {
                    return null;
                  }
                  if (['Button'].includes(type)) {
                    return (
                      <Form.Item
                        key={name}
                        name={name}
                        label={''}
                        style={{ float: 'left', marginRight: 16, marginBottom: 12 }}
                      >
                        <Button
                          type={className}
                          disabled={disabled}
                          className={`form-charts-ant-btn ${className}`}
                          key={name}
                          onClick={() => onSubmit({ ...pageRef.current, type: name })}
                        >
                          {alias}
                        </Button>
                      </Form.Item>
                    );
                  }
                  item = {
                    alias,
                    name,
                    onHidden: false,
                    orderId: sort,
                    require: require,
                    type: 'string',
                    value: ['MultiSelect', 'Select', 'RangePicker'].includes(type) ? [] : undefined,
                    widget: { type }
                  };
                  return (
                    <FormatWidgetToDom
                      key={item?.name}
                      form={form}
                      id={`${item?.name}$%$${type}`}
                      fontSize={fontSize}
                      label={item?.alias || item?.name}
                      config={[item?.name, item]}
                      style={{
                        width: type === 'RangePicker' ? 430 : 300,
                        float: 'left',
                        marginRight: 16,
                        marginBottom: 12,
                      }}
                    />
                  );
                })
              : null;
          }, [timeSelectDefault, fontSize])}
          <Form.Item
            name={'search-btn'}
            label={''}
            style={{ float: 'left', marginRight: 16, marginBottom: 12 }}
          >
            <Button
              type='primary'
              onClick={() => onSubmit({ ...pageRef.current, type: 'search' })}
            >查询</Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table5-charts-body" style={{
        height: `calc(100% - ${domRef?.current?.getElementsByClassName('table5-charts-search')?.[0]?.clientHeight || 0}px)`
      }}>
        <Form form={form} component={false}>
          <BasicTable
            columns={columns}
            dataSource={dataSource}
            bordered={des_bordered}
            pagination={!!dataValue?.total ? {
              total: dataValue?.total,
            } : {}}
            rowKey={(record: any) => record?.id}
            onPageChange={(res: any) => {
              pageRef.current = res;
              onSubmit({ ...res, type: 'search' });
            }}
          />
        </Form>
      </div>
    </div >
  );
};

export default memo(Table5Charts);
