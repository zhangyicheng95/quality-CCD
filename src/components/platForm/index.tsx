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
        const { feat, pen } = getDataFun;
        const data1 = (feat && feat().map((item: any) => _.omit(item, 'layer'))) || [];
        const data2 = (pen && pen()) || [];
        onOk(Object.assign({}, data, { platFormValue: _.uniqBy(data1, 'id').concat(data2) }));
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <MarkCanvas
        data={data}
        setGetDataFun={setGetDataFun}
      />
    </Modal>
  );
};

export default PlatFormModal;
