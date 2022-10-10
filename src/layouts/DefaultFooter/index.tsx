import React from 'react';
import {DefaultFooter,} from '@ant-design/pro-layout';
import useOEM from "@/hooks/useOEM";
import './styles.less';

const BasicFooter = (props: any) => {
	const copyright = useOEM('copyright');
	const links = useOEM('links');
	return (
		copyright || links ? <DefaultFooter
			copyright={copyright}
			links={links}
		/> : null
	)
};

export default BasicFooter;