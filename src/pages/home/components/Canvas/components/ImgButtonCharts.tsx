import React, { useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message, Modal } from 'antd';
import { numToString } from '@/utils/utils';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ImgButtonCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  const {
    dataValue,
    fontSize,
    xColumns = [],
    fetchType,
    xName,
    markNumberLeft,
    markNumberTop,
  } = data;
  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash]);
  const [visible, setVisible] = useState(false);
  const [defect, setDefect] = useState('');
  const [defectSelect, setDefectSelect] = useState<any>({});

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-center ${styles.imgButtonCharts}`}
      style={{ fontSize }}
    >
      <div
        className={`flex-box-center img-button ${ifCanEdit ? 'editColor' : ''}`}
        onClick={() => {
          setDefect(xColumns?.[0]?.value);
          setVisible(true);
        }}
      >
        {ifCanEdit ? '保存后透明' : ''}
      </div>
      {/* {(xColumns || [])?.map((item: any, index: number) => {
        const { label, value, color } = item;
        return (
          <div
            className="flex-box-center img-button-box-item"
            key={value}
            style={!!color ? { backgroundColor: color } : {}}
            onClick={() => {
              setDefect(value);
              setVisible(true);
            }}
          >
            {label}
            <div>{dataValue?.[value]}</div>
          </div>
        );
      })} */}
      {!!visible ? (
        <Modal
          title={`缺陷上报`}
          wrapClassName="defect-modal"
          centered
          width="99vw"
          open={!!visible}
          maskClosable={false}
          destroyOnClose
          onOk={() => {
            if (Object.keys(defectSelect).length > 0) {
              console.log(defectSelect);
              btnFetch(fetchType, xName, { data: defectSelect }).then((res: any) => {
                if (res && res.code === 'SUCCESS') {
                  message.success('上传成功');
                  setVisible(false);
                  setDefectSelect([]);
                } else {
                  message.error(res?.msg || res?.message || '接口异常');
                }
              });
            } else {
              message.warning('请选择缺陷区域');
            }
          }}
          onCancel={() => {
            setVisible(false);
            setDefectSelect([]);
          }}
        >
          <div className="flex-box header-img-button-box">
            {(xColumns || [])?.map((item: any, index: number) => {
              const { label, value } = item;
              return (
                <div
                  className={`flex-box-center header-img-button-box-item ${
                    defect === value ? 'header-img-button-box-selected' : ''
                  }`}
                  onClick={() => setDefect(value)}
                >
                  {label}
                </div>
              );
            })}
          </div>
          <div className="img-button-charts-body">
            {!!markNumberLeft
              ? Array.from({ length: markNumberLeft || 0 }).map((left: any, lIndex: number) => {
                  return (
                    <div className="flex-box img-button-item-line" key={`left-${lIndex}`}>
                      {Array.from({ length: markNumberTop || 0 }).map(
                        (top: any, tIndex: number) => {
                          const title = `${numToString(lIndex + 1)} - ${tIndex + 1}`;
                          return (
                            <div
                              className={`img-button-item-box ${
                                defectSelect?.[defect]?.includes(title)
                                  ? 'img-button-item-box-selected'
                                  : ''
                              }`}
                              key={`top-${tIndex}`}
                              onClick={() => {
                                setDefectSelect((prev: any) => {
                                  return Object.assign({}, prev, {
                                    [defect]: prev?.[defect]?.includes(title)
                                      ? prev?.[defect].filter((i: any) => i !== title)
                                      : (prev?.[defect] || []).concat(title),
                                  });
                                });
                              }}
                            >
                              {title}
                            </div>
                          );
                        },
                      )}
                    </div>
                  );
                })
              : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default ImgButtonCharts;
