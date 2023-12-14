import React, { useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import MarkCanvas from '@/components/platForm/MarkCanvas';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const PlatFormCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue, fontSize, yName, fetchType, xName, ifFetch } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = 10
    }
    const ifCanEdit = useMemo(() => {
        return location.hash.indexOf('edit') > -1;
    }, [location.hash]);
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const { flowData, } = params;
    let { nodes } = flowData;
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
    const { config = {} } = node;
    const { initParams } = config;
    const [getDataFun, setGetDataFun] = useState<any>({ feat: null, pen: null });
    const [selectedFeature, setSelectedFeature] = useState(0);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.platFormCharts} flex-box`}
        >
            {
                ifCanEdit ?
                    null
                    :
                    <MarkCanvas
                        data={Object.assign({ fetchType, xName, ifFetch, fontSize, inHome: true }, initParams[yName], !!dataValue ? { localPath: dataValue } : {})}
                        setGetDataFun={setGetDataFun}
                        getDataFun={getDataFun}
                        selectedFeature={selectedFeature}
                        setSelectedFeature={setSelectedFeature}
                    />
            }
        </div>
    );

};

export default PlatFormCharts;