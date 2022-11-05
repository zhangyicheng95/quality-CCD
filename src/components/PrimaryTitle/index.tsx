import React from 'react';

import styles from './index.less';

interface Props {
  title: any;
  onSearch?: any;
  onClick?: any;
}

const PrimaryTitle: React.FC<Props> = (props: any) => {
  const { title, children, onClick = null } = props;
  return (
    <div
      className={`${styles.primaryTitle} flex-box-start`}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="title" onClick={() => onClick && onClick()}>
        {title}
      </div>
      {children}
    </div>
  );
};

export default PrimaryTitle;
