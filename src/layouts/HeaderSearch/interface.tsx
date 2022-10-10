import React, {useState} from 'react';
import styles from '../RightLayout/index.module.less';
import HeaderSearch from './index';

const HeaderSearchInterface: React.FC<{}> = (props: any) => {
    return (
        <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            defaultOpen={false}
            defaultValue=""
            options={[
                {
                    // label: <a href="next.ant.design">沙河站点</a>,
                    label: '沙河站点',
                    value: '沙河站点',
                }
            ]}
            onSearch={(value: any) => {

            }}
        />
    )
}

export default HeaderSearchInterface;