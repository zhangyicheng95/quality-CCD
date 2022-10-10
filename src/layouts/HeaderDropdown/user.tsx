import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Avatar, Menu, Spin, Drawer} from 'antd';
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import HeaderDropdown from './index';
import {useRecoilState} from "recoil";
import CurrentUser, {CurrentUserState} from "@store/CurrentUser";
import styles from '../RightLayout/index.module.less';


const UserDropdown: React.FC<{}> = (props: any) => {
	/**
	 * 设置是否可见
	 */
	const [visible, setVisible] = useState(false);
	/**
	 * 用户信息
	 */
	const [currentUser, setCurrentUser]: CurrentUserState = useRecoilState(CurrentUser);
	
	const menu: any = null;
	
	const onMenuClick = (event: any) => {
		const {key} = event;
		if (key === 'logout') {
			/**
			 * 将保存的用户信息释放
			 */
			setCurrentUser({});
			props.history.replace({
				pathname: '/login',
			});
			return;
		}
		
		if (key === 'center') {
			setVisible(true);
		}
	};
	
	const menuHeaderDropdown = (
		<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
			{currentUser?.name && (
				<Menu.Item key="center">
					<UserOutlined/>
					个人中心
				</Menu.Item>
			)}
			{menu && (
				<Menu.Item key="settings">
					<SettingOutlined/>
					个人设置
				</Menu.Item>
			)}
			{menu && <Menu.Divider/>}
			
			<Menu.Item key="logout">
				<LogoutOutlined/>
				退出登录
			</Menu.Item>
		</Menu>
	);
	
	return currentUser && currentUser.name ? (
		<HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={currentUser?.avatar || '/avatar.png'} alt="avatar"/>
              <span className={`${styles.name} anticon`}>{currentUser?.name}</span>
                <Drawer
	                zIndex={10000}
	                width={500}
	                title="个人中心"
	                placement="right"
	                closable={false}
	                onClose={() => {
		                setVisible(false);
	                }}
	                visible={visible}
                >
               {/*<UserFormComponent disabled={true} modalData={{name: user.username, organization: '沙河集团'}}/>*/}
            </Drawer>
            </span>
		</HeaderDropdown>
	) : (
		<span className={`${styles.action} ${styles.account}`}>
        <Spin
	        size="small"
	        style={{
		        marginLeft: 8,
		        marginRight: 8,
	        }}
        />
      </span>
	);
};

export default withRouter(UserDropdown);