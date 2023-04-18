import React, { useState } from 'react';
import { Modal, } from 'antd';
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

  return (
    <Modal
      title='数据标注'
      width="calc(100vw - 48px)"
      wrapClassName={styles["plat-form-modal"]}
      centered
      open={visible}
      maskClosable={false}
      onOk={() => {
        const { feat, pen, zoom, value, } = getDataFun;
        const data1 = ((feat && feat().map((item: any) => _.omit(item, 'layer'))) || []).map((item: any) => {
          return Object.assign({}, item, {
            props: Object.assign({}, item?.props, {
              initParams: value?.[item.id],
            }, !!value?.[item.id]?.option_type ? {
              label: value?.[item.id]?.option_type?.value
            } : {})
          })
        });
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
                      }, type === 'RECT' ? {
                        width: { alias: 'width', value: Number(cen[1]?.realValue?.width?.value?.toFixed(2)) },
                        height: { alias: 'height', value: Number(cen[1]?.realValue?.height?.value?.toFixed(2)) }
                      } : {
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
                  type: "RECT",
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
      />
    </Modal>
  );
};

export default PlatFormModal;
