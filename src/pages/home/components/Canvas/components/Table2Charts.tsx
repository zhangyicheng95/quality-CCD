import React from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const Table2Charts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;

    return (
        <div id={`echart-${id}`} className={styles.table2Charts}>
            <div className="charts-header-box flex-box">
                {
                    (data || []).map((item: any, index: number) => {
                        const { name } = item;
                        return <div className="charts-header-item flex-box-center" key={`echart-${id}-tr-th-${index}`}>
                            {name}
                        </div>
                    })
                }
            </div>
            <div className="charts-body-box flex-box">
                {
                    (data || []).map((item: any, index: number) => {
                        const { value } = item;
                        return <div
                            className="charts-body-tr"
                            key={`echart-${id}-tr-${index}`}
                            style={{ width: `${100 / data?.length}%` }}
                        >
                            {
                                (value || []).map((val: any, sIndex: number) => {
                                    return <TooltipDiv
                                        className="charts-body-td"
                                        key={`echart-${id}-tr-td-${sIndex}`}
                                        title={val.length > 15 ? val : ''}
                                    >
                                        {val}
                                    </TooltipDiv>
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