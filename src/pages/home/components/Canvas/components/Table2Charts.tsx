import React from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const Table2Charts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;
    const { value = [] } = !!data[0] ? data[0] : {};

    if (!value) return null;
    return (
        <div id={`echart-${id}`} className={styles.tableCharts}>
            <div className="charts-header-box flex-box">
                {
                    (value[0] || []).map((val: any, sIndex: number) => {
                        return <div className="charts-header-item flex-box-center" key={`echart-${id}-tr-th-${sIndex}`}>
                            {val}
                        </div>
                    })
                }
            </div>

            <div className="charts-body-box">
                {
                    (value.slice(1) || []).map((item: any, index: number) => {
                        return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                            {
                                (item || []).map((val: any, sIndex: number) => {
                                    return <div
                                        className="charts-body-td flex-box-center"
                                        key={`echart-${id}-tr-td-${sIndex}`}
                                        style={val.length > 20 ? { fontSize: 18 } : {}}
                                    >
                                        {val}
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    );

};

export default Table2Charts;