/**
 * @函数名称：RightLayout
 * @param
 * @作用：右边的布局
 * @return：obj
 * @date 2020/9/7
 */

import React from 'react';
import {Settings as ProSettings} from '@ant-design/pro-layout';
import {QuestionCircleOutlined} from '@ant-design/icons';
import styles from './index.module.less';
import UserDropdown from '../HeaderDropdown/user';
import HeaderNaticeInterface from '../HeaderNotice/interface';
import HeaderSearchInterface from '../HeaderSearch/interface';


export interface GlobalHeaderRightProps extends Partial<any>, Partial<ProSettings> {
    theme?: ProSettings['navTheme'] | 'realDark';
}

const ENVTagColor: any = {
    dev: 'orange',
    test: 'green',
    pre: '#87d068',
};

const RightLayout: React.SFC<GlobalHeaderRightProps> = (props) => {
    const {theme, layout, currentUser, fetchingNotices, onNoticeVisibleChange} = props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'top') {
        className = `${styles.right}  ${styles.dark}`;
    }

    const REACT_APP_ENV: any = process.env.REACT_APP_ENV || 'pre';

    return (
        <div className={className}>
            <HeaderSearchInterface/>
            <HeaderNaticeInterface/>
            <UserDropdown/>
        </div>
    );
};

export default RightLayout;
