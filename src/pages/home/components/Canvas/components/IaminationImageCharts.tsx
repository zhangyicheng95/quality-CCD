import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import ImgCharts from './ImgCharts';
import { numToString } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const IaminationImageCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = {}, fontSize,
    des_column,
    markNumberLeft,
    markNumberTop,
    ifOnShowTab,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      0: '',
      1: '',
    };
  }
  const [dataList, setDataList] = useState({});

  useEffect(() => {
    if (!!Object.keys(dataValue)?.length) {
      setDataList((prev: any) => {
        return {
          ...prev,
          ...dataValue
        }
      });
    }
  }, [JSON.stringify(dataValue)]);
  if (!ifOnShowTab) return null;
  return (
    <div id={`echart-${id}`} className={`flex-box-column ${styles.laminationImageCharts}`}>
      {
        !!markNumberTop ?
          <div
            className="flex-box lamination-image-top"
            style={{ width: `calc(100% - ${fontSize}px - 8px)`, height: fontSize + 8, marginLeft: fontSize + 8 }}
          >
            {
              Array.from({ length: markNumberTop || 0 })?.map?.(
                (top: any, tIndex: number) => {
                  return <div
                    className="flex-box-center lamination-image-top-item"
                    key={`lamination-image-top-item-${tIndex}`}
                  >
                    {tIndex + 1}
                  </div>
                }
              )
            }
          </div>
          : null
      }
      <div
        className="flex-box lamination-image-bottom"
        style={{ height: `calc(100% - ${fontSize}px - 8px)` }}
      >
        {
          !!markNumberLeft ?
            <div
              className="flex-box-column lamination-image-bottom-left"
              style={{ width: fontSize + 9, }}
            >
              {
                Array.from({ length: markNumberLeft || 0 })?.map?.(
                  (top: any, lIndex: number) => {
                    const title = `${numToString(lIndex + 1)}`;
                    return <div
                      className="flex-box-center lamination-image-bottom-left-item"
                      key={`lamination-image-bottom-left-item-${lIndex}`}
                    >
                      {title}
                    </div>
                  }
                )
              }
            </div>
            : null
        }
        <div
          className="flex-box-column lamination-image-bottom-right"
          style={{ width: `calc(100% - ${fontSize}px - 8px)` }}
        >
          {
            Array.from({ length: des_column })?.map((i, index: number) => {
              return <div
                className="lamination-image-bottom-right-item"
                key={`lamination-image-bottom-right-item-${index}`}
                style={{ height: `${100 / des_column}%` }}
              >
                <ImgCharts
                  id={`${id.split('$$')[0]}$$${index + 1}$$alertImg`}
                  data={{
                    dataValue: dataList[index] || undefined,
                    notLocalStorage: true,
                    comparison: false,
                    magnifier: true,
                    magnifierSize: 4,
                    ifOnShowTab: true
                  }}
                />
              </div>
            })
          }
        </div>
      </div>
    </div>
  );
};

export default IaminationImageCharts;
