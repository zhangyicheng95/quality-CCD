import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgsCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;

    const [fontSize, setFontSize] = useState('auto');
    const dom = useRef<any>();

    useEffect(() => {
        if (!!dom) {
            if (dom?.current?.clientWidth > data.length * 200) {
                // 说明个数不足一行
                setFontSize('auto')
            } else {
                // 个数超过一行
                const width: number = dom?.current?.firstElementChild?.clientWidth || 150;
                setFontSize(width + 'px')
            }
        }
    }, [dom]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgsCharts} flex-box`}
            // @ts-ignore
            ref={dom}
        >
            {
                (data || []).map((item: any, index: number) => {
                    const { name, value } = item;
                    return <div
                        key={`echart-${id}-${index}`}
                        id={`echart-${id}-${index}`}
                        className={`flex-box img-item`}
                        style={fontSize === 'auto' ? {} : { width: fontSize, maxWidth: fontSize }}
                    >
                        {/* <div className="img-item-left">
                            {name}
                        </div> */}
                        <div className="img-item-right">
                            <div className="img-item-right-top flex-box-center">
                                <Image
                                    src={value}
                                    alt={name || 'logo'}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <TooltipDiv title={name} className="img-item-right-bottom">{name}</TooltipDiv>
                        </div>
                    </div>
                })
            }
        </div>
    );

};

export default ImgsCharts;