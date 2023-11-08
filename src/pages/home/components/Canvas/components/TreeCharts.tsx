import React, { useEffect, } from 'react';
import { message, Tree, } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { DownOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
}

const TreeCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let {
        dataValue, fontSize,
    } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            {
                title: 'parent 1',
                key: '0-0',
                children: [
                    {
                        title: 'parent 1-0',
                        key: '0-0-0',
                        children: [
                            {
                                title: 'leaf',
                                key: '0-0-0-0',
                            },
                            {
                                title: 'leaf',
                                key: '0-0-0-1',
                            },
                            {
                                title: 'leaf',
                                key: '0-0-0-2',
                            },
                        ],
                    },
                    {
                        title: 'parent 1-1',
                        key: '0-0-1',
                        children: [
                            {
                                title: 'leaf',
                                key: '0-0-1-0',
                            },
                        ],
                    },
                    {
                        title: 'parent 1-2',
                        key: '0-0-2',
                        children: [
                            {
                                title: 'leaf',
                                key: '0-0-2-0',
                            },
                            {
                                title: 'leaf',
                                key: '0-0-2-1',
                            },
                        ],
                    },
                ],
            },
            {
                title: 'parent 2',
                key: '1-0',
                children: [
                    {
                        title: 'leafleafleafleaf',
                        key: '1-0-0',
                    },
                    {
                        title: 'leaf',
                        key: '1-0-1',
                    },
                ],
            }
        ];
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('树形组件数据格式不正确，请检查');
            console.log('TreeCharts:', dataValue);
            return;
        }
    }, [dataValue]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.treeCharts} flex-box-center`}
            style={{ fontSize }}
        >
            <Tree
                showLine
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                // defaultExpandedKeys={treeData}
                treeData={dataValue}
            />
        </div>
    );

};

export default TreeCharts;