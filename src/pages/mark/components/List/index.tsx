import React from 'react';
import PrimaryTitle from '@/components/PrimaryTitle';
import styles from './index.less';
import UniverExcel from '@/components/ReactRuler';

const MarkList: React.FC = (props: any) => {
  return (
    <div className={`${styles.markList} page-size background-ubv`}>
      <PrimaryTitle title={'测试专用'}>
        <div
          style={{ height: '100%', width: '100%', gap: 8 }}
          className="flex-box-justify-end"
        ></div>
      </PrimaryTitle>
      <UniverExcel />
    </div>
  );
};

export default MarkList;
