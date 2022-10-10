/**********************************************************************
 *
 * @模块名称: index
 *
 * @模块用途: index
 *
 * @创建人: pgli
 *
 * @date: 2021/8/31 16:36
 *
 **********************************************************************/
import React from 'react';
import {RouteWithChildrenSubRoutes} from "@gaopeng123/hoc";

const RouteWithModuleSubRoutes: React.FC<any> = (props: any) => {
	const {routers} = props;
	return (
		<React.Fragment>
			<React.Suspense fallback={<div>loading...</div>}>
				{
					routers?.map((router: any) => {
						return <RouteWithChildrenSubRoutes key={router.path} {...router}/>
					})
				}
			</React.Suspense>
		</React.Fragment>
	)
};

export default RouteWithModuleSubRoutes;
