import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Input, Button, Spin } from 'antd';

import styles from './index.less';

interface Props {
  title: any;
  style?: any;
  loading?: boolean;
  headerRight?: any;
}

const CustomWindowBody: React.FC<Props> = (props: any) => {
  const { title, children, style, headerRight, loading = false } = props;
  const dom = useRef<any>();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(dom?.current?.clientHeight);
  }, [dom?.current?.clientHeight]);

  return (
    <div className={`flex-box-column ${styles.customWindowBody}`}>
      <Spin spinning={loading} tip={'加载中'}>
        <div className="flex-box-justify-between title-box" ref={dom}>
          <div className="title">{title}</div>
          {headerRight}
        </div>
        <div
          className="body"
          style={Object.assign({}, style, {
            height: `calc(100% - ${headerHeight}px - 16px)`,
          })}
        >
          {children}
        </div>
      </Spin>
    </div>
  );
};

export default CustomWindowBody;
