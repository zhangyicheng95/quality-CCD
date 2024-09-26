import React, { useEffect, useRef, useState } from 'react';
import { Badge, Input } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { guid } from '@/utils/utils';
import ImgCharts from './ImgCharts';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
  data: any;
  id: any;
}
const localData = [
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
  }
];
const ListSwitchImgCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue, fontSize = 20,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData;
  };
  const dom = useRef<any>();
  const [selected, setSelected] = useState<any>(null);
  const [selectedNum, setSelectedNum] = useState({ left: 0, right: 0 });
  const [searchItem, setSearchItem] = useState([]);

  useEffect(() => {
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
    setSearchItem(dataValue || []);
  }, [JSON.stringify(dataValue)]);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.listSwitchImgCharts}`}
      ref={dom}
      style={{ fontSize }}
    >
      <div className="flex-box-column listSwitchImgCharts-left">
        <div className="listSwitchImgCharts-left-search-box">
          <Input.Search
            onSearch={(val) => {
              setSearchItem(() => {
                return dataValue?.filter((i: any) => i?.name?.indexOf(val) > -1);
              });
            }}
          />
        </div>
        <div className="listSwitchImgCharts-left-body">
          {
            (searchItem || [])?.map((item: any, index: number) => {
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
                }}
              >
                {
                  !!status ?
                    <Badge status="success" />
                    : null
                }
                <TooltipDiv title={name}>{name}</TooltipDiv>
              </div>
            })
          }
        </div>
      </div>
      <div className="flex-box-column listSwitchImgCharts-right">
        <div className="listSwitchImgCharts-right-show-id">
          {`当前数据: ${selected?.name}`}
        </div>
        <div className="flex-box listSwitchImgCharts-right-body">
          {
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
                      dataValue: imgs[num] || undefined,
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
