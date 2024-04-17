import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import ImgCharts from './ImgCharts';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 图片监视器组件
const AlertImgCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue = {}, lineNumber = 1, columnNumber = 1, magnifier, magnifierSize } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      1: 'https://img0.baidu.com/it/u=4285923189,2766387018&fm=253&fmt=auto&app=138&f=JPEG?w=281&h=499',
      2: 'https://img.zcool.cn/community/01a24d55efd0006ac7251df84f100f.jpg@3000w_1l_2o_100sh.jpg',
      4: 'https://picnew9.photophoto.cn/20150712/huagongchangjianzhutupian-11762860_1.jpg',
      5: 'https://img-qn.51miz.com/Element/00/16/74/69/000e44be_E167469_6d5c450g.png',
    };
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const dom = useRef<any>();

  useEffect(() => {
    if (!_.isObject(dataValue)) {
      message.error('图片监视器不正确，请检查');
      console.log('AlertImgCharts:', dataValue);
      return;
    }
  }, []);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box ${styles.alertImgCharts}`}
      // @ts-ignore
      ref={dom}
    >
      {Array.from({ length: lineNumber * columnNumber }).map((item: any, index: number) => {
        return (
          <div
            className="flex-box alert-img-item-box"
            key={`alert-${index}`}
            style={Object.assign(
              {},
              { width: `${100 / columnNumber}%`, height: `${100 / lineNumber}%` },
              index + 1 > (lineNumber - 1) * columnNumber ? { borderBottom: 0 } : {},
              (index + 1) % columnNumber === 0 ? { borderRight: 0 } : {},
            )}
          >
            <ImgCharts
              id={`${id.split('$$')[0]}$$${index + 1}$$alertImg`}
              data={{
                dataValue: dataValue[index + 1] || undefined,
                comparison: false,
                magnifier,
                magnifierSize,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AlertImgCharts;
