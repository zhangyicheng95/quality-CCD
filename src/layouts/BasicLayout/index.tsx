/**
 * 布局管理
 */
import React, {useState, createElement, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import proSettings from "@/defaultSettings" ;
import * as Icon from '@ant-design/icons';
import BackUp from './BackTop';
import RightLayout from '../RightLayout/index';
import useOEM from "@/hooks/useOEM";
import {RouteWithModuleRoutes} from '@gaopeng123/hoc';
import {MenuDataItem} from "@ant-design/pro-layout/lib/typings";
import {useRecoilValue} from "recoil";
import Menus, {menuData} from "@store/Menus";
import './styles.less';

/**
 * 创建icon图标
 * @param icon
 */
const createIcon = (icon?: string): React.ReactNode | undefined => {
	const i = icon ? (Icon as any)[icon] : undefined;
	return i ? createElement(i, {
		style: {fontSize: '16px'}
	}) : i;
};

const BasicLayout = (props: any) => {
	/**
	 * 设置重定向数据 默认的加载页面
	 */
	const [pathname, setPathname] = useState<string>(props.history.location.pathname);
	/**
	 * 路由管理
	 */
	const [router, setRouter] = useState<Array<any>>([]);
	/**
	 * OEM数据
	 */
	const menusLogo = useOEM('menusLogo');
	/**
	 * 项目名称
	 */
	const menusName = useOEM('menusName');
	
	/**
	 * 重定向到第一页
	 */
	const redirect = (menuData: MenuDataItem) => {
		if (pathname === '/') {
			setTimeout(() => {
				const firstPath = menuData[0].path as string;
				setPathname(firstPath);
				props.history.push({
					pathname: firstPath
				})
			});
		}
	};
	
	/**
	 * 加载数据
	 */
	useEffect(() => {
		menuData.then((res: Array<any>) => {
			const menuData = res[0];
			setRouter(menuData as Array<any>);
			redirect(menuData);
		});
	}, [menuData]);
	
	return (
		<React.Fragment>
			<ProLayout
				{...proSettings}
				location={{pathname}}
				logo={menusLogo}
				title={menusName}
				route={{routes: router, path: "/"}}
				postMenuData={(menuData: any) => {
					return menuData;
				}}
				// menu={{request: loadMenus, defaultOpenAll: true}}
				menuItemRender={({path, icon, name}: MenuDataItem, defaultDom) => {
					// 渲染菜单项
					return (<div className={`layoutMenuItem`} onClick={() => {
						setPathname(path as string);
					}}>
						{createIcon(icon as string)}
						<Link to={path as string}>
							{name}
						</Link>
					</div>);
				}}
				breadcrumbRender={(routes: any) => {
					// 面包屑
					return routes;
				}}
				itemRender={(route: any, params: any, routes: any, paths: Array<string>) => {
					return null;
				}}
				onPageChange={(location: any) => {
					// 頁面跳轉是觸法
					// setPathname(location.pathname);
				}}
				menuDataRender={(menuList: any) => {
					// menuData 的 render 方法，用来自定义 menuData
					return menuList
				}}
				onMenuHeaderClick={(menu: any) => {
					//      {/*menu 菜单的头部点击事件*/}
				}}
				rightContentRender={() => (<RightLayout/>)}
			>
				<RouteWithModuleRoutes routers={router}/>
			</ProLayout>
			<BackUp/>
		</React.Fragment>
	);
};
export default withRouter(BasicLayout);
