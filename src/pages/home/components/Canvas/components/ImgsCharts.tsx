import React, { useEffect, useRef, useState } from 'react';
import { Image, message } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import TooltipDiv from '@/components/TooltipDiv';
import { useModel } from 'umi';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgsCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue, imgs_width: width = 150, imgs_height: height = 150, } = data;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const dom = useRef<any>();

    const [imgList, setImgList] = useState([]);


    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        let result: any = [];
        const loadFun = (item: any, index: number) => {
            const { name, value } = item;
            const img = document.createElement('img');
            img.src = value;
            img.title = name || 'img.png';
            img.onload = (res: any) => {
                const { width = 1, height = 1 } = img;
                if (width > height) {
                    result = result.concat({ ...item, imgHeight: '100%', imgWidth: 'auto' })
                } else {
                    result = result.concat({ ...item, imgHeight: 'auto', imgWidth: '100%' })
                }
                if (index + 1 === dataValue.length) {
                    console.log(result)
                    setImgList(result);
                    return;
                }
                loadFun(dataValue[index + 1], index + 1);
            };
        };
        loadFun(dataValue[0], 0);
    }, [dataValue,]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgsCharts}`}
            // @ts-ignore
            ref={dom}
        >
            {
                _.isArray(imgList) && (imgList || []).map((item: any, index: number) => {
                    const { name, value, imgWidth, imgHeight } = item;
                    return <div
                        key={`echart-${id}-${index}`}
                        id={`echart-${id}-${index}`}
                        className={`flex-box img-item`}
                        style={{
                            width: width,
                            minWidth: width,
                            maxWidth: width,
                            height: height + 24,
                            minHeight: height + 24,
                            maxHeight: height + 24
                        }}
                    >
                        {/* <div className="img-item-left">
                            {name}
                        </div> */}
                        <div className="img-item-right">
                            <div className="img-item-right-top flex-box-center">
                                <Image
                                    src={value}
                                    alt={name || 'logo'}
                                    style={{ width: imgWidth, height: imgHeight, }}
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