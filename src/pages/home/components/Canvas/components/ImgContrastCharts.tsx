import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Select } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import ImgCharts from './ImgCharts';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
//对比图组件
const ImgContrastCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue = [], fontSize = 16 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        title: '白班',
        value:
          'https://img0.baidu.com/it/u=4285923189,2766387018&fm=253&fmt=auto&app=138&f=JPEG?w=281&h=499',
      },
      {
        title: '晚班',
        value:
          'https://img.zcool.cn/community/01a24d55efd0006ac7251df84f100f.jpg@3000w_1l_2o_100sh.jpg',
      },
    ];
  }
  const dom = useRef<any>();
  const [selected, setSelected] = useState(0);

  const selectOption = useMemo(() => {
    return (dataValue || [])?.map((item: any, index: number) => ({
      label: item?.title,
      value: index,
    }));
  }, [dataValue]);

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('图片对比切换组件不正确，请检查');
      console.log('ImgContrastCharts:', dataValue);
      return;
    }
  }, []);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-center ${styles.ImgContrastCharts}`}
      style={{ fontSize }}
      ref={dom}
    >
      <ImgCharts
        id={`${id.split('$$')[0]}$$1$$imgContrast`}
        data={{
          dataValue: dataValue?.[selected]?.value || '',
          notLocalStorage: true,
          comparison: false,
          magnifier: true,
          magnifierSize: 4,
          onImgChange:
            dataValue?.length > 2
              ? null
              : () => {
                  setSelected((prev: any) => (prev === 1 ? 0 : 1));
                },
        }}
      />
      <div className="img-contrast-select">
        {dataValue?.length > 2 ? (
          <Select
            style={{ width: '100%', fontSize: 14 }}
            options={selectOption}
            value={selected}
            onChange={(value) => {
              setSelected(value);
            }}
          />
        ) : null}
      </div>
      <div className="img-contrast-title-box">{dataValue?.[selected]?.title}</div>
    </div>
  );
};

export default ImgContrastCharts;
