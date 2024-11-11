import React, { Fragment, useRef } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { message, Tooltip } from 'antd';
import { btnFetch } from '@/services/api';
import CustomWindowBody from '@/components/CustomWindowBody';
import { ClearOutlined } from '@ant-design/icons';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const colorList = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const OutputAreaCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      '1': { name: '崩边崩边崩边崩边崩边崩边崩边崩边', isReady: true, value: 88, status: 'INFO' },
      '2': { name: ['缺角', '隐裂', '缺角2', '隐裂2'], isReady: true, value: 88, status: 'ERROR' },
      '3': { name: ['崩边3'], isReady: true, value: 88, status: 'WARNNING' },
      '4': { name: ['崩边4'], isReady: true, value: 88, status: 'INFO' },
      '5': { name: ['崩边5'], isReady: false, value: 88, status: 'SUCCESS' },
    };
  }

  const dom = useRef<any>();

  const onClear = (val: any) => {
    btnFetch(fetchType, xName, { type: 'outputArea', value: val }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.outputAreaCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="" style={{ fontSize }} titleFontSize={titleFontSize}>
        <div className="flex-box output-area-item-box" style={{ marginBottom: 24 }}>
          {Array.from({ length: 10 })?.map?.((item: any, index: number) => {
            const id = 1 + index * 2;
            return (
              <ItemBox
                id={id}
                item={dataValue?.[id]}
                fontSize={fontSize}
                key={`output-area-item-box-item-${id}`}
                onClear={onClear}
              />
            );
          })}
        </div>
        {/* <div className="flex-box-justify-end output-area-center">
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
        </div> */}
        <div className="flex-box output-area-item-box">
          {Array.from({ length: 10 })?.map?.((item: any, index: number) => {
            const id = (index + 1) * 2;
            return (
              <ItemBox
                id={id}
                item={dataValue?.[id]}
                fontSize={fontSize}
                key={`output-area-item-box-${id}`}
                onClear={onClear}
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
  const { id, item = {}, fontSize = 20, onClear } = props;
  const { isReady, name, value, status } = item;

  return (
    <div
      className="output-area-item"
      key={`output-area-item-${id}`}
      style={Object.assign(
        {},
        isReady ? { borderColor: '#88db57' } : {},
        [19, 20].includes(id) ? { marginLeft: 24 } : {},
      )}
    >
      <div className="flex-box-justify-between output-area-item-top">
        <div className="output-area-item-top-left">{id}#</div>
        <div
          className={`flex-box-justify-end output-area-item-top-right`}
          style={{
            fontSize: Math.max(fontSize - 8, 14),
            width: `calc(100% - ${((id + '').length + 1) * fontSize + 8}px)`
          }}
        >
          {id === 19 ? (
            <span className="ant-tag ant-tag-blue">直流</span>
          ) : id === 20 ? (
            <span className="ant-tag ant-tag-cyan">剔除</span>
          ) : _.isArray(name) ? (
            <TooltipDiv
              title={name?.map((itemName: string, indexName: number) => {
                return (
                  <span key={indexName} className={`ant-tag ant-tag-${colorList[indexName]}`}>
                    {itemName?.split('<br/>')?.join(',')}
                  </span>
                );
              })}
            >
              <div className="flex-box-justify-end" style={{ gap: 4 }}>
                {name?.slice(0, 2)?.map((itemName: string, indexName: number) => {
                  return <div key={indexName}>{itemName?.split('<br/>')?.[0]?.slice?.(0, 3)}</div>;
                })}
              </div>
            </TooltipDiv>
          ) : _.isString(name) ? (
            <TooltipDiv
              title={<span className={`ant-tag ant-tag-${colorList[0]}`}>
                {name?.split('<br/>')?.join(',')}
              </span>}
            >
              <div className="flex-box-justify-end" style={{ gap: 4 }}>
                <div>{name?.split('<br/>')?.[0]?.slice?.(0, 3)}</div>
              </div>
            </TooltipDiv>
          ) : null}
        </div>
      </div>
      <div className="flex-box output-area-item-bottom">
        {!_.isEmpty(item) || [19, 20].includes(id) ? (
          <Fragment>
            <div className="output-area-item-bottom-left">
              <div
                className={`flex-box-center output-area-item-bottom-left-item`}
                onClick={() => {
                  !!onClear && onClear(id);
                }}
              >
                <ClearOutlined style={{ fontSize: Math.max(24, fontSize) }} />
                <div style={{ fontSize: 12, marginTop: 2 }}>清零</div>
              </div>
            </div>
            <div
              className="output-area-item-bottom-right"
              style={{ fontSize: 56, ...(value?.color ? { color: value?.color } : {}) }}
            >
              {_.isString(value) || _.isNumber(value) ? value : value?.value}
            </div>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
