import { Button, Tooltip } from 'antd';
import styles from './index.less';

export default function ToolbarItem(props: any) {
  const { onClick, title, disabled, tooltipProps, children } = props;

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  }

  return (
    <Tooltip
      placement="bottom"
      className={`flex-box-center ${styles.toolbarItem}`}
      title={
        <span style={{ fontSize: 12 }}>{title}</span>
      }
      {...tooltipProps}
    >
      <Button
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </Button>
      {/* <span
        className="fabritor-toolbar-item"
        style={{
          color: disabled ? '#cccccc' : 'rgba(0, 0, 0, 0.88)'
        }}

      >

      </span> */}
    </Tooltip>
  )
}