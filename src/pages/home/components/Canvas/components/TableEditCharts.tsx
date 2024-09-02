import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Input, message, Select, Spin, Switch, Upload } from 'antd';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import styles from '../index.module.less';
import { downFileFun, readTextFile, stringToNum } from '@/utils/utils';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const TableEditCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue = '', fontSize, fetchType, xName, yName, ifFetch, ifOnShowTab,
  } = data;
  const [form] = Form.useForm();
  const domRef = useRef<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [options, setOptions] = useState([]);
  const [sourceName, setSourceName] = useState<any>('');
  const [dataSource, setDataSource] = useState<any>([]);

  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  useEffect(() => {
    if (!!ifFetch && !!yName) {
      btnFetch(fetchType, xName, { type: yName, method: 'read' }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setOptions(res.data);
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, [ifFetch, yName]);

  useEffect(() => {
    if (!!dataValue && dataValue?.length > 5 && !!localStorage.getItem('parentOrigin')) {
      fetch(`file://${dataValue}`)
        .then((response) => {
          response.text();
        })
        .then((data) => console.log('50:', data));

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
    accept: '?.xlsx,.csv',
    showUploadList: false,
    multiple: false,
    beforeUpload(file: any) {
      console.log('file', file);
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (res: any) => {
        console.log('78', res);
        try {
          /****************解析excel******************/
          const workbook = XLSX.read(res.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          let maxLength = 0;
          jsonData.forEach?.((i: any) => {
            if (maxLength < i?.length) {
              maxLength = i.length;
            }
          });
          const result: any = jsonData?.map?.((item: any) => {
            if (item?.length < maxLength) {
              item = item.concat(Array.from({ length: maxLength - item?.length }));
            }
            return Array.from(item)?.map?.((i: any) => {
              if (!!i) {
                return i;
              } else {
                return ` `;
              }
            });
          });
          console.log('格式化的', result);
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
  const onFileChange = (val: string) => {
    if (!!val && !!localStorage.getItem('parentOrigin')) {
      readTextFile(val, (text: any) => {
        const list = text.Sheets?.Sheet1;
        let maxRow = 0;
        let maxCol = 0;
        (Object.entries(list) || [])?.forEach?.((item: any) => {
          if (item[0]?.indexOf('A') > -1) {
            const num = item[0]?.split('A')?.[1];
            if (maxRow < num) {
              maxRow = num;
            }
          }
          if (item[0]?.indexOf('A') > -1) {
            maxCol = 1;
          } else if (item[0]?.indexOf('B') > -1) {
            maxCol = 2;
          } else if (item[0]?.indexOf('C') > -1) {
            maxCol = 3;
          } else if (item[0]?.indexOf('D') > -1) {
            maxCol = 4;
          } else if (item[0]?.indexOf('E') > -1) {
            maxCol = 5;
          } else if (item[0]?.indexOf('F') > -1) {
            maxCol = 6;
          } else if (item[0]?.indexOf('G') > -1) {
            maxCol = 7;
          } else if (item[0]?.indexOf('H') > -1) {
            maxCol = 8;
          } else if (item[0]?.indexOf('I') > -1) {
            maxCol = 9;
          } else if (item[0]?.indexOf('J') > -1) {
            maxCol = 10;
          } else if (item[0]?.indexOf('K') > -1) {
            maxCol = 11;
          } else if (item[0]?.indexOf('L') > -1) {
            maxCol = 12;
          } else if (item[0]?.indexOf('M') > -1) {
            maxCol = 13;
          } else if (item[0]?.indexOf('N') > -1) {
            maxCol = 14;
          } else if (item[0]?.indexOf('O') > -1) {
            maxCol = 15;
          } else if (item[0]?.indexOf('P') > -1) {
            maxCol = 16;
          } else if (item[0]?.indexOf('Q') > -1) {
            maxCol = 17;
          } else if (item[0]?.indexOf('R') > -1) {
            maxCol = 18;
          } else if (item[0]?.indexOf('S') > -1) {
            maxCol = 19;
          } else if (item[0]?.indexOf('T') > -1) {
            maxCol = 20;
          } else if (item[0]?.indexOf('U') > -1) {
            maxCol = 21;
          } else if (item[0]?.indexOf('V') > -1) {
            maxCol = 22;
          } else if (item[0]?.indexOf('W') > -1) {
            maxCol = 23;
          } else if (item[0]?.indexOf('X') > -1) {
            maxCol = 24;
          } else if (item[0]?.indexOf('Y') > -1) {
            maxCol = 25;
          } else if (item[0]?.indexOf('Z') > -1) {
            maxCol = 26;
          }
        });
        let jsonData: any = new Array(maxRow).fill(new Array(maxCol).fill(undefined));
        (Object.entries(list) || [])?.forEach?.((item: any) => {
          if (item[0]?.indexOf('A') > -1) {
            const rowNum = item[0]?.split('A')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('A') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('B') > -1) {
            const rowNum = item[0]?.split('B')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('B') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('C') > -1) {
            const rowNum = item[0]?.split('C')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('C') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('D') > -1) {
            const rowNum = item[0]?.split('D')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('D') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('E') > -1) {
            const rowNum = item[0]?.split('E')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('E') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('F') > -1) {
            const rowNum = item[0]?.split('F')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('F') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('G') > -1) {
            const rowNum = item[0]?.split('G')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('G') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('H') > -1) {
            const rowNum = item[0]?.split('H')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('H') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('I') > -1) {
            const rowNum = item[0]?.split('I')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('I') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('J') > -1) {
            const rowNum = item[0]?.split('J')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('J') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('K') > -1) {
            const rowNum = item[0]?.split('K')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('K') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('L') > -1) {
            const rowNum = item[0]?.split('L')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('L') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('M') > -1) {
            const rowNum = item[0]?.split('M')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('M') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('N') > -1) {
            const rowNum = item[0]?.split('N')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('N') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('O') > -1) {
            const rowNum = item[0]?.split('O')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('O') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('P') > -1) {
            const rowNum = item[0]?.split('P')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('P') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('Q') > -1) {
            const rowNum = item[0]?.split('Q')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('Q') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('R') > -1) {
            const rowNum = item[0]?.split('R')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('R') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('S') > -1) {
            const rowNum = item[0]?.split('S')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('S') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('T') > -1) {
            const rowNum = item[0]?.split('T')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('T') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('U') > -1) {
            const rowNum = item[0]?.split('U')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('U') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('V') > -1) {
            const rowNum = item[0]?.split('V')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('V') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('W') > -1) {
            const rowNum = item[0]?.split('W')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('W') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('X') > -1) {
            const rowNum = item[0]?.split('X')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('X') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('Y') > -1) {
            const rowNum = item[0]?.split('Y')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('Y') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          } else if (item[0]?.indexOf('Z') > -1) {
            const rowNum = item[0]?.split('Z')[1];
            if (!jsonData[rowNum - 1]) {
              jsonData[rowNum - 1] = [];
            }
            jsonData[rowNum - 1][stringToNum('Z') - 1] = [!!item[1]?.v ? item[1]?.v : ` `];
          }
        });
        jsonData = jsonData.filter(Boolean);
        console.log('格式化的', jsonData);
        setDataSource(jsonData);
        setSourceName(val);
        setLoading(false);
      });

      // const messageFun = (e: any) => {
      //   if (e.data.from === 'read' && e.data.name === 'tableEditReadFile') {
      //     console.log('TableEditCharts收到消息', e.data.payload);
      //     setDataSource(JSON.parse(e.data.payload || '[]'));
      //   }
      // };
      // window?.addEventListener?.('message', messageFun);

      // window?.parent?.postMessage?.(
      //   { type: 'readFile', name: 'tableEditReadFile', path: val },
      //   localStorage.getItem('parentOrigin') || '',
      // );
    } else {
      setDataSource([]);
    }
  };
  if (!ifOnShowTab) return null;
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
                    if (!itemSec) {
                      itemSec = ` `;
                    }
                    return (
                      <div
                        className="flex-box table-edit-item-box-td"
                        key={`table-edit-item-box-td-${indexSec}`}
                      >
                        {[0].includes(index) || (item?.length > 5 && [0, 1].includes(indexSec)) ? (
                          <div className="flex-box table-edit-item-box-td-title">{itemSec}</div>
                        ) : ['true', 'false'].includes(_.lowerCase(itemSec)) ? (
                          <Switch
                            defaultChecked={JSON.parse(itemSec)}
                            onChange={(val) => onChange(JSON.stringify(val), [index, indexSec])}
                          />
                        ) : ['开启', '关闭'].includes(_.lowerCase(itemSec)) ? (
                          <Switch
                            defaultChecked={_.lowerCase(itemSec) === '开启' ? true : false}
                            onChange={(val) => onChange(JSON.stringify(val), [index, indexSec])}
                          />
                        ) : (
                          <Input
                            defaultValue={itemSec}
                            onChange={(e: any) => onChange(e?.target?.value, [index, indexSec])}
                          />
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
            {ifFetch ? (
              <Select
                options={options || []}
                style={{ width: 200 }}
                onChange={(e) => onFileChange(e)}
              />
            ) : null}
            <Upload {...onUploadExcel}>
              <Button type="default">上传 Excel / CSV</Button>
            </Upload>
            {sourceName?.indexOf('csv') > -1 ? (
              // @ts-ignore
              <CSVLink data={dataSource} filename={sourceName}>
                <Button type="primary">保存</Button>
              </CSVLink>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  // 构造要导出的数据结构,不需要表头
                  // const header = dataSource[0];
                  // const body = dataSource?.slice(1);
                  // const exportData = dataSource.map((item) => {
                  //   return [item[0], item[1]];
                  // });
                  // 将数据转换为 worksheet 对象
                  const worksheet = XLSX.utils.aoa_to_sheet(dataSource, { sheetStubs: false }); // 将 worksheet 对象添加到 workbook 中
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                  // 导出 Excel 文件
                  XLSX.writeFile(workbook, sourceName);
                  // downFileFun(JSON.stringify(dataSource), sourceName);
                }}
              >
                保存
              </Button>
            )}
            {/* {!!sourceName ? (
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
            ) : null} */}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(TableEditCharts);
