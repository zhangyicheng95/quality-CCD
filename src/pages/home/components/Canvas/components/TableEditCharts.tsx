import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Input, message, Spin, Switch, Upload } from 'antd';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import styles from '../index.module.less';
import { downFileFun } from '@/utils/utils';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const TableEditCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let { dataValue = '', fontSize, xColumns = [], yColumns = [] } = data;
  const [form] = Form.useForm();
  const domRef = useRef<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [sourceName, setSourceName] = useState<any>('');
  const [dataSource, setDataSource] = useState<any>([]);

  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  useEffect(() => {
    if (!!dataValue && !!localStorage.getItem('parentOrigin')) {
      const messageFun = (e: any) => {
        if (e.data.from === 'read' && e.data.name === 'tableEditReadFile') {
          console.log('TableEditCharts收到消息', e.data.payload);
          setDataSource(JSON.parse(e.data.payload || '[]'));
        }
      };
      window?.addEventListener?.('message', messageFun);

      window?.parent?.postMessage?.(
        { type: 'readFile', name: 'tableEditReadFile', path: dataValue },
        localStorage.getItem('parentOrigin') || '',
      );
    } else {
      setDataSource([]);
    }
  }, [dataValue]);

  const onUploadExcel = {
    accept: '.xlsx,.csv',
    showUploadList: false,
    multiple: false,
    beforeUpload(file: any) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (res: any) => {
        try {
          /****************解析excel******************/
          const workbook = XLSX.read(res.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const result = jsonData?.map?.((item: any) => {
            return item
              .join('$@$')
              .split('$@$')
              ?.map?.((i: any) => {
                if (!!i) {
                  return i;
                } else {
                  return '';
                }
              });
          });
          if (file?.name?.indexOf('csv') > -1) {
            Papa.parse(file, {
              header: true, //包含第一行
              skipEmptyLines: false, //过滤空行
              fastMode: true, //极速模式
              step: function (results, parser) {
                //DO MY THING HERE
                parser.abort();
              },
              complete: function (results) {
                result[0] = results?.meta?.fields;
                /****************解析excel******************/
                setDataSource(result);
                setSourceName(file?.name);
                setLoading(false);
              },
            });
          } else {
            setDataSource(result);
            setSourceName(file?.name);
            setLoading(false);
          }
        } catch (err) {
          message.error('文件格式错误，请修改后上传。');
          console.error(err);
        }
      };
      reader.readAsBinaryString(file);
      return false;
    },
  };
  const onChange = (val: any, index: any) => {
    setDataSource((prev: any) =>
      prev?.map?.((item: any, ind: number) => {
        if (ind === index[0]) {
          return item?.map?.((itemSec: any, indSec: number) => {
            if (indSec === index[1]) {
              return val;
            } else {
              return itemSec;
            }
          });
        } else {
          return item;
        }
      }),
    );
  };
  const onSubmit = () => {
    downFileFun(dataSource, sourceName);
  };

  return (
    <div id={`echart-${id}`} className={styles.tableEditCharts} ref={domRef} style={{ fontSize }}>
      <Spin spinning={loading} tip="加载中">
        <div className="edit-charts-body">
          <Form form={form} component={false}>
            {(dataSource || [])?.map?.((item: any, index: number) => {
              return (
                <div
                  className="flex-box table-edit-item-box"
                  key={`table-edit-item-box-${index}`}
                  style={{ height: (fontSize / 2) * 7 }}
                >
                  {(item || [])?.map?.((itemSec: string, indexSec: number) => {
                    return (
                      <div
                        className="table-edit-item-box-td"
                        key={`table-edit-item-box-td-${indexSec}`}
                      >
                        {!!itemSec ? (
                          [0, 1].includes(index) ||
                          (item?.length > 5 && [0, 1].includes(indexSec)) ? (
                            <div className="flex-box table-edit-item-box-td-title">{itemSec}</div>
                          ) : ['true', 'false'].includes(_.lowerCase(itemSec)) ? (
                            <Switch
                              defaultChecked={JSON.parse(itemSec)}
                              onChange={(val) => onChange(JSON.stringify(val), [index, indexSec])}
                            />
                          ) : (
                            <Input
                              defaultValue={itemSec}
                              onChange={(e: any) => onChange(e?.target?.value, [index, indexSec])}
                            />
                          )
                        ) : (
                          <div className="table-edit-item-box-td-title"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Form>
        </div>
        {ifCanEdit ? null : (
          <div className="flex-box-center edit-table-footer">
            <Upload {...onUploadExcel}>
              <Button type="default">上传 Excel / CSV</Button>
            </Upload>
            {sourceName?.indexOf('csv') > -1 ? (
              // @ts-ignore
              <CSVLink data={dataSource} filename={sourceName}>
                <Button type="primary">导出</Button>
              </CSVLink>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  downFileFun(JSON.stringify(dataSource), sourceName);
                }}
              >
                导出
              </Button>
            )}
            {!!sourceName ? (
              <Button
                type="default"
                danger
                onClick={() => {
                  setDataSource([]);
                  setSourceName('');
                }}
              >
                清理
              </Button>
            ) : null}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(TableEditCharts);
