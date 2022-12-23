import React, { useEffect } from 'react';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4",
    }, yName, xName } = data;
    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <div id={`echart-${id}`} className={styles.tableCharts}>
            <div className="charts-header-box flex-box">
                <div className="charts-header-item flex-box-center">
                    {yName}
                </div>
                <div className="charts-header-item flex-box-center">
                    {xName}
                </div>
            </div>
            <div className="charts-body-box">
                {
                    Object.entries(dataValue).map((item: any, index: number) => {
                        return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                            <div className="charts-body-td flex-box-center">{item[0]}</div>
                            <div className="charts-body-td flex-box-center">{item[1]}</div>
                        </div>
                    })
                }
            </div>
        </div>
    );

};

export default TableCharts;