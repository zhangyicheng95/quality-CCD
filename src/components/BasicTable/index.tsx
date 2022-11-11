import React, { Fragment, useEffect } from 'react';
import { Table, Pagination } from 'antd';

import styles from './index.less';

const BasicTable = (props: any) => {
  const { dataSource, summary, pagination, ...rest } = props;

  return (
    <div className={styles.basicTable}>
      <Table
        scroll={{ y: pagination !== null ? 'calc(100% - 55px)' : '100%' }}
        dataSource={dataSource}
        pagination={pagination !== null ? {
          total: dataSource.length,
          // showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          defaultPageSize: 20,
          // showTotal: (total, range) => `共${total}条`,
        } : false}
        {...rest}
      />
    </div>
  );
};

export default BasicTable;
