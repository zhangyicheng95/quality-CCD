import React, {useState} from 'react';
import HeaderNatice from './index';
import {Tooltip, message} from 'antd';
import styles from '../RightLayout/index.module.less';

const HeaderNaticeInterface: React.FC<{}> = (props: any) => {
    const {fetchingNotices, onNoticeVisibleChange} = props;
    return (
        <HeaderNatice
            className={styles.action}
            count={5}
            onItemClick={(item) => {

            }}
            loading={fetchingNotices}
            clearText="清空"
            viewMoreText="查看更多"
            onClear={() => {

            }}
            onPopupVisibleChange={() => {

            }}
            onViewMore={() => message.info('Click on view more')}
            clearClose
        >
            <HeaderNatice.Tab
                tabKey="alert"
                count={5}
                list={[]}
                title="告警"
                emptyText="你已查看所有通知"
                showViewMore
            />
            <HeaderNatice.Tab
                tabKey="notification"
                count={5}
                list={[]}
                title="处置"
                emptyText="你已查看所有处置"
                showViewMore
            />
        </HeaderNatice>
    )
}

export default HeaderNaticeInterface;