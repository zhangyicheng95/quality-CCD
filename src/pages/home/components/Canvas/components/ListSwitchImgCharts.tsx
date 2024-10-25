import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Badge, Input, message, DatePicker, Button } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { guid } from '@/utils/utils';
import ImgCharts from './ImgCharts';
import TooltipDiv from '@/components/TooltipDiv';
import BasicTable from '@/components/BasicTable';
import { btnFetch } from '@/services/api';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
interface Props {
  data: any;
  id: any;
}
const localData1 = [
  {
    "name": "10:26|LM8F7E898RA12848",
    "status": true,
    "children": {
      "left": {
        "imgs": [
          {
            "position": { "label": "", "value": "右" },
            "carType": { "label": "车型", "value": "206_2" },
            "url": 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0',
            "point": { "label": "点位", "value": "8" },
            "status": { "label": "", "value": "OK" },
          },
          `http://localhost:8866/${guid()}.jpg`
        ]
      },
      "right": {
        "imgs": [
          `http://localhost:8866/${guid()}.jpg`,
          'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
        ]
      }
    }
  },
  {
    "name": "10:26|LM8F7E898RA12847",
    "status": false,
    "children": {
      "left": {
        "imgs": [
          [
            { carType: 'F1', 'position': '左', 'result': 'OK', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
            { carType: 'F2', 'position': '右', 'result': 'OK', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
            { carType: 'F2', 'position': '左', 'result': 'NG', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
            { carType: 'F3', 'position': '左', 'result': 'NG', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1223', 'camera': '2' },
          ]
        ]
      },
      "right": {
        "imgs": [
          `http://localhost:8866/${guid()}.jpg`,
          'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
        ]
      }
    }
  }
];
const localData2 = {
  type: 'list',
  data: [
    {
      "name": "10:26|LM8F7E898RA12848",
      "status": true,
      "children": {
        "left": {
          "imgs": [
            {
              "position": { "label": "", "value": "右" },
              "carType": { "label": "车型", "value": "206_2" },
              "url": 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0',
              "point": { "label": "点位", "value": "8" },
              "status": { "label": "", "value": "OK" },
            },
            `http://localhost:8866/${guid()}.jpg`
          ]
        },
        "right": {
          "imgs": [
            `http://localhost:8866/${guid()}.jpg`,
            'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
          ]
        }
      }
    },
    {
      "name": "10:26|LM8F7E898RA12847",
      "status": false,
      "children": {
        "left": {
          "imgs": [
            [
              { carType: 'F1', 'position': '左', 'result': 'OK', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
              { carType: 'F2', 'position': '右', 'result': 'OK', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
              { carType: 'F2', 'position': '左', 'result': 'NG', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1', 'camera': '1' },
              { carType: 'F3', 'position': '左', 'result': 'NG', 'pointName': '前地板地毯前段（左）、前门门槛总成（左）', 'point': '1223', 'camera': '2' },
            ]
          ]
        },
        "right": {
          "imgs": [
            `http://localhost:8866/${guid()}.jpg`,
            'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0'
          ]
        }
      }
    }
  ]
};
const ListSwitchImgCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue, fontSize = 20, modelRotate = '1', fetchType, xName,
    tableFontSize = 16, magnifierSize = 14
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = modelRotate === '1' ? localData1 : localData2;
  };
  const domRef = useRef<any>();
  const timeSelected = useRef(moment(new Date()).format(dateFormat));
  const [leftList, setLeftList] = useState([]);
  const [selected, setSelected] = useState<any>(null);
  const [selectedNum, setSelectedNum] = useState({ left: 0, right: 0 });
  const [searchItem, setSearchItem] = useState('');
  const [tableSource, setTableSource] = useState<any>([]);
  const [rightImgSource, setRightImgSource] = useState('');

  useEffect(() => {
    if (modelRotate === '1') {
      if (!!dataValue?.length) {
        setSelected(dataValue?.[dataValue?.length - 1]);
        setSelectedNum({
          left: dataValue?.[dataValue?.length - 1]?.children?.['left']?.imgs?.length - 1,
          right: dataValue?.[dataValue?.length - 1]?.children?.['right']?.imgs?.length - 1
        });
      } else {
        setSelected(null);
        setSelectedNum({ left: 0, right: 0 });
      }
    } else {
      if (dataValue?.type === 'list') {
        setLeftList(dataValue?.data || []);
      } else if (dataValue?.type === 'table') {
        setTableSource(dataValue?.data || []);
      } else if (dataValue?.type === 'img') {
        setRightImgSource(dataValue?.data || '');
      }
    }
  }, [JSON.stringify(dataValue)]);
  const tableColumns = [
    {
      title: '车型',
      dataIndex: 'carType',
      key: 'carType',
      align: 'center',
      width: `${fontSize * 3 + 32}px`
    },
    {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
      width: `${fontSize * 2 + 32}px`
    },
    {
      title: '检测结果',
      dataIndex: 'result',
      key: 'result',
      align: 'center',
      width: `${fontSize * 5 + 32}px`,
      filters: [
        {
          text: 'OK',
          value: 'OK',
        },
        {
          text: 'NG',
          value: 'NG',
        }
      ],
      onFilter: (value: string, record: any) => record?.result?.indexOf?.(value) > -1,
    },
    {
      title: '点位名称',
      dataIndex: 'pointName',
      key: 'pointName',
    },
    {
      title: '点位',
      dataIndex: 'point',
      key: 'point',
      align: 'center',
      width: `${fontSize * 3 + 32}px`
    },
    {
      title: '相机',
      dataIndex: 'camera',
      key: 'camera',
      align: 'center',
      width: `${fontSize * 2 + 32}px`
    }
  ];
  const onModalChange = (params: any) => {
    if (!!fetchType && !!xName) {
      btnFetch(fetchType, xName, params).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('success');
        } else {
          message.error(
            res?.msg || res?.message || '后台服务异常，请重启服务',
          );
        }
      });
    } else {
      message.error('请先设置服务接口');
    }
  };

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.listSwitchImgCharts}`}
      ref={domRef}
      style={{ fontSize }}
    >
      <div className="flex-box-column listSwitchImgCharts-left">
        {
          modelRotate === '1' ?
            null
            :
            <div className="listSwitchImgCharts-left-search-box">
              <DatePicker
                style={{ fontSize }}
                popupClassName="listSwitchImgCharts-left-search-box-range-picker"
                defaultValue={moment(new Date(), dateFormat)}
                format="YYYY-MM-DD"
                onChange={(dates: any, dateStrings: any) => {
                  timeSelected.current = dateStrings
                  onModalChange({ time: dateStrings });
                }}
              />
              <Input.Search
                onSearch={(val) => {
                  setSearchItem(val);
                }}
              />
            </div>
        }
        <div className="listSwitchImgCharts-left-body">
          {
            (modelRotate === '2' ? leftList : dataValue || [])
              ?.filter((i: any) => i?.name?.indexOf(searchItem) > -1)
              ?.slice(0, 20)
              ?.map((item: any, index: number) => {
                const { name, status, children } = item;
                return <div
                  className={`flex-box listSwitchImgCharts-left-body-item ${selected?.name === name ? 'selected' : ''}`}
                  key={`listSwitchImgCharts-left-body-item-${index}`}
                  onClick={() => {
                    setSelected(item);
                    setSelectedNum({
                      left: children?.['left']?.imgs?.length - 1,
                      right: children?.['right']?.imgs?.length - 1
                    });
                    onModalChange({ name: name?.split('|')?.[1]?.trim?.() });

                    if (process.env.NODE_ENV === 'development') {
                      setTableSource([
                        {
                          "carType": "F1",
                          "position": "左",
                          "result": "OK",
                          "pointName": "前地板地毯前段（左）、前门门槛总成（左）",
                          "point": "1",
                          "camera": "1"
                        },
                        {
                          "carType": "F2",
                          "position": "右",
                          "result": "OK",
                          "pointName": "前地板地毯前段（左）、前门门槛总成（左）",
                          "point": "1",
                          "camera": "1"
                        },
                        {
                          "carType": "F2",
                          "position": "右",
                          "result": "OK",
                          "pointName": "前地板地毯前段（左）、前门门槛总成（左）",
                          "point": "1",
                          "camera": "1"
                        }
                      ])
                    }
                  }}
                >
                  {
                    !!status ?
                      <Badge status="success" />
                      :
                      <Badge status="error" />
                  }
                  <TooltipDiv title={name}>{name}</TooltipDiv>
                </div>
              })
          }
        </div>
        {
          modelRotate === '2' ?
            <div className="flex-box-center listSwitchImgCharts-left-footer">
              <Button type="primary" onClick={() => {
                onModalChange({ type: 'export', time: timeSelected.current });
              }}>导出数据</Button>
            </div>
            : null
        }
      </div>
      <div className="flex-box-column listSwitchImgCharts-right">
        <div className="listSwitchImgCharts-right-show-id">
          {`当前数据: ${selected?.name}`}
        </div>
        <div className="flex-box listSwitchImgCharts-right-body" style={{ fontSize: magnifierSize }}>
          {
            modelRotate === '2' ?
              <Fragment>
                <div className="flex-box listSwitchImgCharts-right-body-item">
                  <BasicTable
                    style={{ fontSize: tableFontSize }}
                    columns={tableColumns}
                    dataSource={tableSource?.map((item: any) => ({ id: guid(), ...item }))}
                    rowKey={(record: any) => record?.id}
                    defaultExpandAllRows={true}
                    pagination={null}
                    getPopupContainer={() => {
                      return domRef.current;
                    }}
                    className={`listSwitchImgCharts-right-body-item-table`}
                    onRow={(record: any) => {
                      return {
                        onClick: () => {
                          onModalChange({ name: selected?.name, ...record });
                        }
                      };
                    }}
                  />
                </div>
                <div className="flex-box listSwitchImgCharts-right-body-item">
                  <ImgCharts
                    id={`${id.split('$$')[0]}$$${selected?.name}$$alertImg`}
                    data={{
                      dataValue: rightImgSource,
                      comparison: false,
                      magnifier: true,
                      magnifierSize: 4,
                      showFooter: true,
                      notLocalStorage: true,
                    }}
                  />
                </div>
              </Fragment>
              :
              !!selected?.children ?
                (Object.entries(selected?.children) || [])?.map((item: any, index: number) => {
                  const name = item[0];
                  const { imgs } = item[1];
                  const num = selectedNum[name];
                  return <div
                    key={`listSwitchImgCharts-right-body-item-${index}`}
                    className="flex-box listSwitchImgCharts-right-body-item"
                  >
                    <ImgCharts
                      id={`${id.split('$$')[0]}$$${selected?.name}${name}$$alertImg`}
                      data={{
                        dataValue: modelRotate === '2' ? rightImgSource : imgs[num],
                        comparison: false,
                        magnifier: true,
                        magnifierSize: 4,
                        showFooter: true,
                        notLocalStorage: true,
                      }}
                    />
                    <div className="flex-box listSwitchImgCharts-right-body-item-btn-box">
                      <div
                        className={`${num === 0 ? 'greyColorStyle' : ''} prev-btn`}
                        onClick={() => {
                          if (num > 0) {
                            setSelectedNum((prev: any) => ({ ...prev, [name]: prev[name] - 1 }));
                          }
                        }}
                      >
                        {'< '}
                      </div>
                      {`${num + 1}/${imgs?.length}`}
                      <div
                        className={`next-btn ${num + 1 === imgs.length ? 'greyColorStyle' : ''
                          }`}
                        onClick={() => {
                          if (num + 1 < imgs.length) {
                            setSelectedNum((prev: any) => ({ ...prev, [name]: prev[name] + 1 }));
                          }
                        }}
                      >
                        {' >'}
                      </div>
                    </div>
                  </div>
                })
                : null
          }
        </div>
      </div>
    </div>
  );
};

export default ListSwitchImgCharts;
