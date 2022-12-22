import React, { useEffect } from 'react';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableCharts: React.FC<Props> = (props: any) => {
    const { data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}], id, } = props;
    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <div id={`echart-${id}`} className={styles.tableCharts}>
            <div className="charts-header-box flex-box">
                <div className="charts-header-item flex-box-center">
                    key
                </div>
                <div className="charts-header-item flex-box-center">
                    value
                </div>
            </div>
            <div className="charts-body-box">
                {
                    (data || []).map((item: any, index: number) => {
                        return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                            <div className="charts-body-td flex-box-center">缺陷检测{index}</div>
                            <div className="charts-body-td flex-box-center">检测结果{index}</div>
                        </div>
                    })
                }
            </div>
        </div>
    );

};

export default TableCharts;