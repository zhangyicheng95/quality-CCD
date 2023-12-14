import React, { useMemo, useRef } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import { useModel } from 'umi';
import BasicTable from '@/components/BasicTable';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const Table4Charts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let {
        dataValue = [], fontSize,
    } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            {
                key: 1,
                name: 'John Brown sr.',
                age: '',
                address: '',
                children: [
                    {
                        key: 11,
                        name: 'John Brown',
                        age: 42,
                        address: 'New York No. 2 Lake Park',
                    },
                    {
                        key: 12,
                        name: 'John Brown jr.',
                        age: '',
                        address: '',
                        children: [
                            {
                                key: 121,
                                name: 'Jimmy Brown',
                                age: 16,
                                address: 'New York No. 3 Lake Park',
                            },
                        ],
                    },
                    {
                        key: 13,
                        name: 'Jim Green sr.',
                        age: '',
                        address: '',
                        children: [
                            {
                                key: 131,
                                name: 'Jim Green',
                                age: '',
                                address: '',
                                children: [
                                    {
                                        key: 1311,
                                        name: 'Jim Green jr.',
                                        age: 25,
                                        address: 'London No. 3 Lake Park',
                                    },
                                    {
                                        key: 1312,
                                        name: 'Jimmy Green sr.',
                                        age: 18,
                                        address: 'London No. 4 Lake Park',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                key: 2,
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            },
        ];
    }
    const { initialState = {} } = useModel<any>('@@initialState');
    const { params } = initialState;
    const domRef = useRef<any>(null);
    const columns: any = useMemo(() => {
        let result: any = [];
        if (!!dataValue?.[0] && !!Object.keys(dataValue?.[0])?.length) {
            let obj = Object.keys(_.omit(_.omit(dataValue?.[0], 'key'), 'children'));
            // obj = _.omit(_.omit(obj, 'children'), 'key')
            obj.forEach((item: string) => {
                if (_.isString(item)) {
                    result.push({
                        title: item,
                        dataIndex: item,
                        key: item,
                    });
                }
            });
        }

        return result;
    }, [dataValue]);
    return (
        <div
            id={`echart-${id}`}
            className={styles.table4Charts}
            ref={domRef}
            style={{ fontSize }}
        >
            <BasicTable
                columns={columns}
                dataSource={dataValue}
                defaultExpandAllRows={true}
                pagination={null}
            />
        </div>
    );

};

export default Table4Charts;