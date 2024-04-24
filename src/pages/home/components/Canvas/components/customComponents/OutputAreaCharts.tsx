import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { AutoComplete, Button, Col, Form, Input, InputNumber, message, Row } from 'antd';
import { btnFetch } from '@/services/api';
import { useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';
import CustomWindowBody from '@/components/CustomWindowBody';
import ChooseFileButton from '@/components/ChooseFileButton';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const OutputAreaCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      '1': { name: '崩边', isReady: true, value: 88, status: 'INFO' },
      '2': { name: '缺角\n隐裂', isReady: true, value: 88, status: 'ERROR' },
      '3': { name: '崩边3', isReady: true, value: 88, status: 'WARNNING' },
      '4': { name: '崩边4', isReady: true, value: 88, status: 'INFO' },
      '5': { name: '崩边5', isReady: false, value: 88, status: 'SUCCESS' },
    };
  }

  const dom = useRef<any>();

  const onClear = (val: any) => {
    btnFetch(fetchType, xName, { type: 'outputArea', value: val }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.outputAreaCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="出料区" style={{ fontSize }}>
        <div className="flex-box output-area-item-box">
          {Array.from({ length: 9 })?.map?.((item: any, index: number) => {
            const id = 1 + index * 2;
            return (
              <ItemBox
                id={id}
                item={dataValue?.[id]}
                fontSize={fontSize}
                key={`output-area-item-box-item-${id}`}
              />
            );
          })}
        </div>
        <div className="flex-box-justify-end output-area-center">
          <div
            className="flex-box-center output-area-center-line"
            style={{ fontSize: titleFontSize }}
            ref={dom}
          >
            出料区
          </div>
          {[19, 20]?.map?.((item: any) => {
            return (
              <div
                className="flex-box-justify-between output-area-center-item"
                key={`output-area-center-item${item}`}
              >
                <div className="output-area-center-item-btn-top">
                  {item === 19 ? '剔除' : '直流'}
                </div>
                <div className="output-area-center-item-center">
                  {_.isNumber(dataValue?.[item]?.value) || _.isString(dataValue?.[item]?.value)
                    ? dataValue?.[item]?.value
                    : dataValue?.[item]?.value?.value || 0}
                </div>
                <div className="output-area-center-item-btn-bottom" onClick={() => onClear(item)}>
                  清零
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-box output-area-item-box">
          {Array.from({ length: 9 })?.map?.((item: any, index: number) => {
            const id = (index + 1) * 2;
            return (
              <ItemBox
                id={id}
                item={dataValue?.[id]}
                fontSize={fontSize}
                key={`output-area-item-box-${id}`}
              />
            );
          })}
        </div>
      </CustomWindowBody>
    </div>
  );
};

export default OutputAreaCharts;

function ItemBox(props: any) {
  const { id, item, fontSize = 20 } = props;
  if (!item) {
    return (
      <div className="output-area-item" key={`output-area-item-${id}`}>
        <div className="flex-box-justify-between output-area-item-top">
          <div className="output-area-item-top-left">{id}#</div>
          <div
            className={`output-area-item-top-right`}
            style={{ fontSize: Math.max(fontSize - 8, 14) }}
          >
            未就绪
          </div>
        </div>
        <div className="flex-box output-area-item-bottom"></div>
      </div>
    );
  }
  const { isReady, name, value, status } = item;
  return (
    <div className="output-area-item" key={`output-area-item-${id}`}>
      <div className="flex-box-justify-between output-area-item-top">
        <div className="output-area-item-top-left">{id}#</div>
        <div
          className={`output-area-item-top-right ${isReady ? 'success' : ''}`}
          style={{ fontSize: Math.max(fontSize - 8, 14) }}
        >
          {isReady ? '就绪' : '未就绪'}
        </div>
      </div>
      <div className="flex-box output-area-item-bottom">
        <div className="output-area-item-bottom-left">
          <div
            className={`flex-box-center output-area-item-bottom-left-item ${_.lowerCase(status)}`}
            style={value?.color ? { color: value?.color } : {}}
          >
            {_.isString(value) || _.isNumber(value) ? value : value?.value}
          </div>
          {/* <div className="output-area-item-bottom-left-item">{min}</div> */}
        </div>
        <div className="output-area-item-bottom-right">
          <div
            dangerouslySetInnerHTML={{
              // 此处需要处理
              __html: name,
            }}
          />
        </div>
      </div>
    </div>
  );
}
