import React, { Fragment, useEffect } from 'react';
import {
  Tooltip
} from 'antd';

import styles from './index.less';

interface Props {
  title?: any;
  style?: any;
  placement?: any;
  onClick?: any;
  className?: any;
  children: any;
}

const TooltipDiv = (props: any) => {
  const { title = '', style = {}, children = null, placement = 'topLeft', onClick = null, className = '', ...rest } = props;
  return <Header {...props}>
    <div className={`${styles.toolTipDiv} ${className}`} style={({ ...(onClick ? {
      cursor: 'pointer',
      color: 'rgba(24, 144, 255, 1)'
    } : {}), ...style})} {...rest} onClick={onClick}>
      {children}
    </div>
  </Header>;
};

const Header = (props: any) => {
  const { children, title = '', placement = 'topLeft' } = props;
  if (title) {
    return <Tooltip title={title} placement={placement}>
      {children}
    </Tooltip>;
  } 
    return <>
      {children}
    </>;
  
};

export default TooltipDiv;
