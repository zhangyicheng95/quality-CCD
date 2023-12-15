import React, { useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import MarkCanvas from '@/components/platForm/MarkCanvas';
import PlatFormModal from '@/components/platForm';
import { Button } from 'antd';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const PlatFormCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue, fontSize, fetchType, xName, ifFetch, platFormOptions } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = 10
    }
    const ifCanEdit = useMemo(() => {
        return location.hash.indexOf('edit') > -1;
    }, [location.hash]);
    const [platFormVisible, setPlatFormVisible] = useState(true);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.platFormCharts} flex-box`}
        >
            {
                platFormVisible ?
                    // <MarkCanvas
                    //      data={Object.assign({
                    //     name: 'imageLabel', alias: '正极相机区域配置', require: true, type: 'File',
                    //     widget: { type: 'ImageLabelField', options: JSON.parse(platFormOptions) },
                    //     fetchType, xName, ifFetch, fontSize, inHome: true
                    // }, !!dataValue ? { localPath: dataValue } : {})}
                    //     setGetDataFun={setGetDataFun}
                    //     getDataFun={getDataFun}
                    //     selectedFeature={selectedFeature}
                    //     setSelectedFeature={setSelectedFeature}
                    // />
                    <PlatFormModal
                        visible={true}
                        data={Object.assign({
                            name: 'imageLabel', alias: '正极相机区域配置', require: true, type: 'File',
                            widget: { type: 'ImageLabelField', options: JSON.parse(platFormOptions) },
                            fetchType, xName, ifFetch, fontSize, inHome: true
                        }, !!dataValue ? { localPath: dataValue } : {})}
                    />
                    :
                    <Button onClick={() => setPlatFormVisible(true)}>开始标注</Button>
            }
        </div>
    );

};

export default PlatFormCharts;