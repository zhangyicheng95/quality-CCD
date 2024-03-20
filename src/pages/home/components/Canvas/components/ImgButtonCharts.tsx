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
  const { fontSize, xColumns = [], fetchType, xName, yName, markNumberLeft, markNumberTop } = data;
  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash]);
  const [visible, setVisible] = useState(false);
  const [defect, setDefect] = useState('');
  const [defectSelect, setDefectSelect] = useState<any>({});

  const onDefectClick = (type: string) => {
    if (!yName) return;
    return new Promise((resolve, reject) => {
      btnFetch('get', yName, { type }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          setDefectSelect((prev: any) => {
            return {
              ...prev,
              [type]: res.data || [],
            };
          });
          resolve(true);
        } else {
          message.error(res?.msg || res?.message || '接口异常');
        }
      });
    });
  };
  const onUpload = () => {
    setDefectSelect((prev: any) => {
      if (Object.keys(prev).length > 0) {
        if (!fetchType || !xName) return;
        btnFetch(fetchType, xName, { data: prev }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('上传成功');
            setVisible(false);
            setDefectSelect({});
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
        });
      } else {
        message.warning('请选择缺陷区域');
      }

      return prev;
    });
  };
  const onKeyDown = (event: any) => {
    const { key } = event;
    if (key === '1') {
      if (!fetchType || !xName) return;
      // 触发接口传OK
      btnFetch(fetchType, xName, { data: {} }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('上传成功');
        } else {
          message.error(res?.msg || res?.message || '接口异常');
        }
      });
    } else if (key === '4') {
      onDefectClick(xColumns?.[0]?.value)?.then((res) => {
        setDefect(xColumns?.[0]?.value);
        setVisible(true);
      });
    } else if (key === 'Enter') {
      setVisible((prev) => {
        if (prev) {
          onUpload();
        }
        return prev;
      });
    }
  };
  useEffect(() => {
    if (ifCanEdit) return;
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-center ${styles.imgButtonCharts}`}
      style={{ fontSize }}
    >
      <div
        className={`flex-box-center img-button ${ifCanEdit ? 'editColor' : ''}`}
        onClick={() => {
          onDefectClick(xColumns?.[0]?.value)?.then((res) => {
            setDefect(xColumns?.[0]?.value);
            setVisible(true);
          });
        }}
      >
        {ifCanEdit ? '保存后透明' : ''}
      </div>
      {!!visible ? (
        <Modal
          title={`缺陷上报`}
          wrapClassName="defect-modal"
          centered
          width="99vw"
          open={!!visible}
          maskClosable={false}
          destroyOnClose
          onOk={() => onUpload()}
          onCancel={() => {
            setVisible(false);
            setDefectSelect({});
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
                  onClick={() => {
                    setDefect(value);
                    onDefectClick(value);
                  }}
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
                          const title = `${numToString(lIndex + 1)}-${tIndex + 1}`;
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
