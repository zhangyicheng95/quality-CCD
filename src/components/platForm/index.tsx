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
        const { feat, pen, zoom, value } = getDataFun;
        const data1 = ((feat && feat().map((item: any) => _.omit(item, 'layer'))) || []).map((item: any) => {
          return Object.assign({}, item, {
            props: Object.assign({}, item?.props, {
              initParams: value?.[item.id]
            })
          })
        });
        const data2 = (pen && pen()) || [];
        const params = Object.assign({}, data,
          {
            zoom,
            platFormValue: _.uniqBy(data1, 'id').concat(data2),
            value: _.uniqBy(data1, 'id').concat(data2).map((item: any) => {
              const { props, shape, type, id } = item;
              const { initParams } = props;
              if (type === 'RECT') {
                return {
                  id,
                  type: "RECT",
                  roi: shape,
                  ...initParams
                }
              } else if (type === 'LINE') {
                return {
                  id,
                  type: "LINE",
                  roi: shape,
                  ...initParams
                }
              } else if (type === 'CIRCLE') {
                return {
                  id,
                  type: "CIRCLE",
                  roi: shape,
                  ...initParams
                }
              } else if (type === 'POINT') {
                return {
                  id,
                  type: "POINT",
                  roi: shape,
                  ...initParams
                }
              }
            })
          }
        );
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
