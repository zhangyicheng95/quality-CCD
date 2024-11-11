import { Button } from 'antd';

import BasicScrollBar from '../BasicScrollBar';

import styles from './index.less';

const NodeDetailWrapper = (props: any) => {
  const { title, children, onSave = null, onCancel = null, className, ...rest } = props;

  return (
    <div className={`${styles.nodeDetailWrapper} ${className}`} {...rest}>
      {!!title ? (
        <div className="nodeDetailWrapper_header flex-box">
          <div className="label">{title}</div>
        </div>
      ) : null}
      <div className="content" style={!title ? { height: 'calc(100% - 50px)' } : {}}>
        <BasicScrollBar>{children}</BasicScrollBar>
      </div>
      {
        !!onCancel && !!onSave ?
          <div className="flex-box node-sider-footer">
            {
              !!onCancel ?
                <Button
                  className="sider-footer-btn"
                  onClick={() => {
                    onCancel?.();
                  }}
                >
                  取消
                </Button>
                : null
            }
            {
              !!onSave ?
                <Button
                  className="sider-footer-btn"
                  type="primary"
                  disabled={!onSave}
                  onClick={() => {
                    onSave?.();
                  }}
                >
                  确定
                </Button>
                : null
            }
          </div>
          : null
      }
    </div>
  );
};

export default NodeDetailWrapper;
