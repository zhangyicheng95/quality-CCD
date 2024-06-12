import { Button } from 'antd';

import BasicScrollBar from '../BasicScrollBar';

import styles from './index.less';

const NodeDetailWrapper = (props: any) => {
  const { title, children, onSave = null, onCancel = null, className, ...rest } = props;

  return (
    <div className={`${styles.nodeDetailWrapper} ${className}`} {...rest}>
      <div className="nodeDetailWrapper_header flex-box">
        <div className="label">{title}</div>
      </div>
      <div className="content">
        <BasicScrollBar>{children}</BasicScrollBar>
      </div>
      <div className="flex-box node-sider-footer">
        <Button
          className="sider-footer-btn"
          onClick={() => {
            onCancel();
          }}
        >
          取消
        </Button>
        <Button
          className="sider-footer-btn"
          type="primary"
          disabled={!onSave}
          onClick={() => {
            onSave();
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};

export default NodeDetailWrapper;
