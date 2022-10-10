import { DropDownProps } from "antd/es/dropdown";
import { Dropdown } from "antd";
import React from "react";
import classNames from "classnames";
import styles from "./index.module.less";

declare type OverlayFunc = () => React.ReactNode;

export interface HeaderDropdownProps extends Omit<DropDownProps, "overlay"> {
  overlayClassName?: string;
  overlay: React.ReactNode | OverlayFunc | any;
  placement?:
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomCenter";
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => {
  return (
    <Dropdown
      overlayClassName={classNames(styles.container, cls)}
      {...restProps}
    />
  );
};

export default HeaderDropdown;
