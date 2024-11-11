import React, { Fragment, useCallback } from 'react';
import { LogoutOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { getUserData } from '@/utils/utils';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录
 */
const loginOut = async () => {
  localStorage.removeItem('userInfo');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const userData = getUserData();
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      let hash = '';
      if (location.href?.indexOf('?') > -1) {
        hash = location.href.split('?')[1];
      }
      if (key === 'logout') {
        setInitialState((s: any) => ({ ...s, currentUser: undefined }));
        loginOut();
        location.href = `${location.href?.split('#/')?.[0]}#/home${!!hash ? `?${hash}` : ''}`;
        window.location.reload();
        return;
      }
      if (key === 'toLogin') {
        setInitialState((s: any) => ({ ...s, currentUser: undefined }));
        loginOut();
        location.href = `${location.href?.split('#/')?.[0]}#/user/login${!!hash ? `?${hash}` : ''}`;
        window.location.reload();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`action account`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  const menuHeaderDropdown = (
    <Menu className={'menu'} selectedKeys={[]} onClick={onMenuClick}>
      {!!userData?.loginTime ? (
        <Fragment>
          <Menu.Item key="toLogin">
            <UserSwitchOutlined />
            切换用户
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout">
            <LogoutOutlined />
            退出登录
          </Menu.Item>
        </Fragment>
      ) : (
        <Menu.Item key="toLogin">
          <LogoutOutlined />
          登录
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`action account`}>
        <Avatar size="small" className={'avatar'} src={userData?.img} alt="avatar" />
        <span className={`name anticon`}>{userData.nickName || userData.userName || '访客'}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
