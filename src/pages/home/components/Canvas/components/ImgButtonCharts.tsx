import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, message, Modal } from 'antd';
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
    yName,
    markNumberLeft,
    markNumberTop,
    fileTypes,
    fileFetch,
  } = data;
  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash]);
  const itemClicked = useRef(0); //记录按键次数，下一次数据来了之后清空
  const [visible, setVisible] = useState(false);
  const [defect, setDefect] = useState('');
  const [defectSelect, setDefectSelect] = useState<any>({});
  const [fileVisible, setFileVisible] = useState(false);
  const [fileSelect, setFileSelect] = useState<any>([]);

  useEffect(() => {
    if (!!dataValue?.action && dataValue.action === 1) {
      itemClicked.current = 0;
    }
  }, [dataValue]);

  const onDefectClick = () => {
    if (itemClicked.current > 0) {
      message.warning('只允许上传一次');
      return;
    }
    if (!yName) return;
    btnFetch('get', yName, {}).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        itemClicked.current += 1;
        setDefectSelect(res.data);
        setDefect(xColumns?.[0]?.value);
        setVisible(true);
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  };
  const onUpload = () => {
    setDefectSelect((prev: any) => {
      if (!fetchType || !xName) return;
      btnFetch(fetchType, xName, { data: prev }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('上传成功');
          onCancel();
        } else {
          message.error(res?.msg || res?.message || '接口异常');
        }
      });

      return prev;
    });
  };
  const onFileUpload = () => {
    if (itemClicked.current > 0) {
      message.warning('只允许上传一次');
      return;
    }
    if (!fileFetch) return;
    btnFetch(fetchType, fileFetch, { data: fileSelect }).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        itemClicked.current += 1;
        message.success('上传成功');
        onCancel();
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  };
  const onKeyDown = (event: any) => {
    const { key } = event;
    if (key === '1') {
      if (itemClicked.current > 0) {
        message.warning('只允许上传一次');
        return;
      }
      if (!fetchType || !xName) return;
      // 触发接口传OK
      btnFetch(fetchType, xName, { data: {} }).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          itemClicked.current += 1;
          message.success('上传成功');
        } else {
          message.error(res?.msg || res?.message || '接口异常');
        }
      });
    } else if (key === '4') {
      onDefectClick();
    } else if (key === '9') {
      setFileVisible(true);
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
  const onCancel = () => {
    setVisible(false);
    setDefectSelect({});
    setFileVisible(false);
    setFileSelect([]);
  };

  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-center ${styles.imgButtonCharts}`}
      style={{ fontSize }}
    >
      <div
        className={`flex-box-center img-button ${ifCanEdit ? 'editColor' : ''}`}
        onClick={() => onDefectClick()}
      >
        {ifCanEdit ? '保存后透明' : ''}
      </div>
      {!!visible ? (
        <Modal
          title="缺陷上报"
          wrapClassName="defect-modal"
          centered
          width="99vw"
          open={!!visible}
          maskClosable={false}
          destroyOnClose
          onCancel={() => onCancel()}
          footer={
            <div className="flex-box-end" style={{ gap: 8 }}>
              <Button
                type="link"
                onClick={() => {
                  setDefectSelect((prev: any) => {
                    return _.omit(prev, defect + '');
                  });
                }}
              >
                清空当前缺陷
              </Button>
              <Button onClick={() => onCancel()}>取消</Button>
              <Button type="primary" onClick={() => onUpload()}>
                上传
              </Button>
            </div>
          }
        >
          <div className="flex-box header-img-button-box">
            {(xColumns || [])?.map((item: any, index: number) => {
              const { label, value } = item;
              return (
                <div
                  className={`flex-box-center header-img-button-box-item ${
                    defect == value ? 'header-img-button-box-selected' : ''
                  }`}
                  onClick={() => {
                    setDefect(value);
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
                                defectSelect?.[defect + '']?.includes(title)
                                  ? 'img-button-item-box-selected'
                                  : ''
                              }`}
                              key={`top-${tIndex}`}
                              onClick={() => {
                                setDefectSelect((prev: any) => {
                                  let result = Object.assign({}, prev);
                                  if (prev?.[defect + '']?.includes(title)) {
                                    if (
                                      prev?.[defect + ''].filter((i: any) => i !== title)?.length
                                    ) {
                                      result[defect + ''] = prev?.[defect + ''].filter(
                                        (i: any) => i !== title,
                                      );
                                    } else {
                                      result = _.omit(prev, defect + '');
                                    }
                                  } else {
                                    result[defect + ''] = (prev?.[defect + ''] || []).concat(title);
                                  }
                                  return result;
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

      {!!fileVisible ? (
        <Modal
          title="返工归档"
          wrapClassName="file-type-modal"
          centered
          // width="40vw"
          open={!!fileVisible}
          maskClosable={false}
          destroyOnClose
          onCancel={() => onCancel()}
          onOk={() => onFileUpload()}
        >
          <div className="flex-box file-type-box">
            {(fileTypes || [])?.map((item: any) => {
              return (
                <div
                  className={`file-type-item ${
                    fileSelect?.includes(item) ? 'file-type-item-selected' : ''
                  }`}
                  onClick={() => {
                    setFileSelect((prev: any) => {
                      if (prev?.includes(item)) {
                        return prev.filter((i: any) => i !== item);
                      } else {
                        return (prev || []).concat(item);
                      }
                    });
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default ImgButtonCharts;
