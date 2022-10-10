/**
 * 布局管理
 */
import React from 'react';
import { BackTop} from 'antd';
import { UpOutlined} from '@ant-design/icons';

export default function BackUp(props: any) {
    return (
        <BackTop>
            <div style={{
                height: 40,
                width: 40,
                lineHeight: '40px',
                color: '#1890ff',
                textAlign: 'center',
                fontSize: 12,
            }}>UP<UpOutlined/></div>
        </BackTop>
    );
}