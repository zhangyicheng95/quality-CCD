import React from 'react';
import PrimaryTitle from '@/components/PrimaryTitle';
import styles from './index.less';
import UniverExcel from '@/components/ReactRuler';

const MarkList: React.FC = (props: any) => {
  return (
    <div className={`${styles.markList} page-size background-ubv`}>
      <PrimaryTitle title={'测试专用'}></PrimaryTitle>
      <div className="history-content-box">
        <UniverExcel />
      </div>
    </div>
  );
};

export default MarkList;
