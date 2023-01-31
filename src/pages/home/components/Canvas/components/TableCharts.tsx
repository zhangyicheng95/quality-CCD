import React from 'react';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [], yName, xName, fontSize, reverse } = data;

    return (
        <div id={`echart-${id}`} className={styles.tableCharts} style={{ fontSize }}>
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
                    (!!reverse ? dataValue.reverse() : dataValue).map((item: any, index: number) => {
                        const { name, value } = item;
                        return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                            <div className="charts-body-td flex-box-center">{name}</div>
                            <div className="charts-body-td flex-box-center">{value}</div>
                        </div>
                    })
                }
            </div>
        </div>
    );

};

export default TableCharts;