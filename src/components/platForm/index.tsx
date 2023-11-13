import React, { useState } from 'react';
import { message, Modal, } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';
import MarkCanvas from './MarkCanvas';

interface Props {
  data?: any;
  visible: any;
  onOk: any;
  onCancel: any;
}

const PlatFormModal: React.FC<Props> = (props) => {
  const {
    data,
    visible,
    onOk,
    onCancel,
  } = props;
  const [getDataFun, setGetDataFun] = useState<any>({ feat: null, pen: null });
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <Modal
      title='数据标注'
      width="calc(100vw - 48px)"
      wrapClassName={styles["plat-form-modal"]}
      centered
      open={visible}
      maskClosable={false}
      onOk={() => {
        if (!!selectedFeature) {
          message.warning("请先保存设置框");
          return false;
        }
        const { feat, pen, zoom, value, } = getDataFun;
        const data1 = ((feat && feat().map((item: any) => _.omit(item, 'layer'))) || [])
          .map((item: any) => {
            const { id, props, type, shape } = item;
            if (type === 'LINE') {
              if (!shape?.start?.x || !shape?.end?.x) {
                return null;
              }
            } else if (type === 'RECT') {
              if (!shape?.x || !shape?.width) {
                return null;
              }
            } else if (type === 'CIRCLE') {
              if (!shape?.cx || !shape?.cy) {
                return null;
              }
            } else if (type === 'POINT') {
              if (!shape?.x || !shape?.y || !shape?.sr) {
                return null;
              }
            }
            return Object.assign({}, item, {
              props: Object.assign({}, props, {
                initParams: value?.[id],
              }, !!value?.[id]?.option_type ? {
                label: value?.[id]?.option_type?.value
              } : {})
            });
          }).filter(Boolean);
        let ifCangoOn = true;
        try {
          data1.forEach((item: any) => {
            const { id, props, type, shape } = item;
            const { initParams = {} } = props;
            if ((!props?.type || props?.type?.indexOf('AXIS') < 0) && !initParams?.option_type) {
              ifCangoOn = false;
              throw new Error();
            }
          });
        } catch (err) {

        }
        if (!ifCangoOn) {
          message.error('画框未进行标注，请返回标注');
          return;
        }
        const data2 = (pen && pen()) || [];
        const params = Object.assign({}, data,
          {
            zoom,
            platFormValue: _.uniqBy(data1, 'id').concat(data2),
            value: _.uniqBy(data1, 'id').concat(data2).map((item: any) => {
              const { props, shape, type, id } = item;
              const { initParams = {} } = props;
              const initValue = Object.entries(initParams)?.reduce((pre: any, cen: any) => {
                return Object.assign({}, pre, (cen[0] === 'roi') ?
                  (!!cen[1]?.realValue?.x ?
                    {
                      [cen[0]]: Object.assign({}, {
                        cx: {
                          alias: "cx",
                          value: Number(cen[1]?.realValue?.x?.value?.toFixed(2))
                        },
                        cy: {
                          alias: "cy",
                          value: Number(cen[1]?.realValue?.y?.value?.toFixed(2))
                        },
                      }, type === 'RECT' ? Object.assign(
                        {
                          width: { alias: 'width', value: Number(cen[1]?.realValue?.width?.value?.toFixed(2)) },
                          height: { alias: 'height', value: Number(cen[1]?.realValue?.height?.value?.toFixed(2)) }
                        },
                        props?.type === 'AXIS' ?
                          {
                            xLength: { alias: 'xLength', value: Number(cen[1]?.realValue?.xLength?.value?.toFixed(2)) },
                            yLength: { alias: 'yLength', value: Number(cen[1]?.realValue?.yLength?.value?.toFixed(2)) },
                          }
                          : {}
                      ) : {
                        ..._.omit(_.omit(cen[1]?.realValue, "x"), "y"),
                      })
                    }
                    : {})
                  :
                  { [cen[0]]: cen[1]?.value });
              }, {});
              if (type === 'RECT') {
                return {
                  // id,
                  type: props.type || "RECT",
                  roi: {
                    cx: { alias: "cx", value: shape.x + shape.width / 2 },
                    cy: { alias: "cy", value: shape.y + shape.height / 2 },
                    width: { alias: "width", value: Number(shape.width?.toFixed(2)) },
                    height: { alias: "height", value: Number(shape.height?.toFixed(2)) }
                  },
                  ...initValue
                }
              } else if (type === 'LINE') {
                return {
                  // id,
                  type: "LINE",
                  roi: shape,
                  ...initValue
                }
              } else if (type === 'CIRCLE') {
                return {
                  // id,
                  type: "CIRCLE",
                  roi: shape,
                  ...initValue
                }
              } else if (type === 'POINT') {
                return {
                  // id,
                  type: "POINT",
                  roi: shape,
                  ...initValue
                }
              }
            }).filter(Boolean)
          }
        );
        console.log(params)
        onOk(params);
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <MarkCanvas
        data={data}
        setGetDataFun={setGetDataFun}
        getDataFun={getDataFun}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />
    </Modal>
  );
};

export default PlatFormModal;
