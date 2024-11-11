import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Table, Pagination, Spin } from 'antd';
import styles from './index.less';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  title: any;
  icon?: any;
  iconSize?: any;
  direction?: any;
  style?: any;
  disabled?: boolean;
  loading?: boolean;
  hover?: boolean;
  selected?: any;
  onClick?: any;
}
const BasicButton: React.FC<Props> = (props: any) => {
  const {
    title,
    icon = null,
    disabled = false,
    loading = false,
    onClick,
    direction,
    style = {},
    iconSize,
    selected,
    hover,
  } = props;
  const dom = useRef<any>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(loading);
  }, [loading]);

  const imgSize = useMemo(() => {
    return (
      iconSize ||
      Math.max(Math.min(dom?.current?.clientWidth, dom?.current?.clientHeight), 80) * 0.4
    );
  }, [iconSize, dom?.current?.clientWidth, dom?.current?.clientHeight]);

  return (
    <div
      className={`flex-box ${styles.basicButton} ${disabled || load ? 'greyColorStyle' : ''}`}
      ref={dom}
      style={Object.assign({}, direction === 'vertical' ? { flexDirection: 'column' } : {}, style)}
      onClick={() => {
        if (!disabled && !load && !selected) {
          !!onClick && onClick?.();
        }
      }}
    >
      {!!icon || load ? (
        <div
          className="flex-box basic-button-icon"
          style={{
            width: imgSize,
            minWidth: imgSize,
            minHeight: imgSize,
            height: imgSize,
          }}
        >
          {load ? <LoadingOutlined /> : icon}
        </div>
      ) : null}
      <div
        className={`basic-button-name ${hover && !selected ? 'hover' : ''} ${selected ? 'font-selected' : ''
          }`}
      >
        {title}
      </div>
    </div>
  );
};

export default BasicButton;
