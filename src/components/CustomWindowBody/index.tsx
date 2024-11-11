import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Input, Button, Spin } from 'antd';

import styles from './index.less';
import TooltipDiv from '../TooltipDiv';

interface Props {
  title: any;
  style?: any;
  className?: any;
  titleFontSize?: any;
  loading?: boolean;
  headerRight?: any;
}

const CustomWindowBody: React.FC<Props> = (props: any) => {
  const {
    title,
    children,
    style,
    className,
    titleFontSize = 24,
    headerRight,
    loading = false,
  } = props;
  const dom = useRef<any>();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(dom?.current?.clientHeight);
  }, [dom?.current?.clientHeight]);

  return (
    <div className={`flex-box-column ${styles.customWindowBody} ${className}`}>
      <Spin spinning={loading} tip={'加载中'}>
        <div
          className="flex-box-justify-between title-box"
          ref={dom}
          style={{ fontSize: titleFontSize }}
        >
          <TooltipDiv className="title" style={{ width: titleFontSize * (title?.length + 4) }}>
            {title}
          </TooltipDiv>
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
