import React, { useEffect, useRef, useState } from 'react';
import { Image, message, Skeleton } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { EyeOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue, windowControl, setContentList } = data;
    // dataValue = 'https://img1.baidu.com/it/u=4278632386,1202646523&fm=253&fmt=auto&app=138&f=JPEG?w=751&h=500';
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [fontSize, setFontSize] = useState({ width: '100%', height: 'auto' });
    const dom = useRef<any>();

    useEffect(() => {
        if (!_.isString(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        const img = document.createElement('img');
        img.src = dataValue;
        img.title = 'img.png';
        img.onload = (res: any) => {
            const { width = 1, height = 1 } = img;
            if (width > height) {
                setFontSize({ width: '100%', height: 'auto' });
            } else {
                setFontSize({ width: 'auto', height: '100%' });
            }
        };
    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);
    useEffect(() => {
        const eventDom: any = document.getElementById('img-charts-event1');
        const mask: any = dom?.current?.querySelector('.mask');
        if (!eventDom || !mask) return;
        eventDom.onmousemove = function (event: any) {
            //offsetX：鼠标坐标到元素的左侧的距离
            //offsetWidth 除了外边距(margin)以外，所有的宽度(高度)之和
            const { pageX = 0, pageY = 0, offsetX = 0, offsetY = 0 } = event;
            let left = offsetX - mask?.offsetWidth / 2;
            //offsetY：鼠标坐标到元素的顶部的距离
            //offsetHeight:元素的像素高度 包含元素的垂直内边距和边框,水平滚动条的高度,且是一个整数
            let top = offsetY - mask?.offsetHeight / 2;
            //  约束范围,保证光标在div范围内，都是以父盒子div为参考对象的
            //超出图片左侧
            if (!left || (left <= 0)) left = 0;
            // 超出图片右侧
            if (left >= mask?.offsetWidth) left = mask?.offsetWidth;
            if (!top || (top <= 0)) top = 0;
            if (top >= mask?.offsetHeight) top = mask?.offsetHeight;
            // 修改元素的left|top属性值
            // 遮罩层
            mask.style['left'] = left + "px";
            mask.style['top'] = top + "px";
            let bigDom: any = document.getElementsByClassName('img-charts-big')[0];
            let imgDom: any = document.getElementById('img-charts-bigImg');
            if (!imgDom) {
                bigDom = document.createElement('div');
                bigDom.className = 'img-charts-big';
                document.body.appendChild(bigDom);
                imgDom = document.createElement('img');
                imgDom.id = 'img-charts-bigImg';
                imgDom.src = dataValue;
                bigDom.appendChild(imgDom);
            } else {
                bigDom.style.display = 'block';
            }
            let { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
            // 放大镜的位置
            const offset = 20;
            if (pageX > bodyWidth / 2) {
                bigDom.style['left'] = bodyWidth - pageX - offset + "px";
            } else {
                bigDom.style['left'] = pageX + offset + "px";
            }
            if (pageY > bodyHeight / 2) {
                bigDom.style['top'] = bodyHeight - pageY - offset + "px";
            } else {
                bigDom.style['top'] = pageY + offset + "px";
            }
            // 放大镜大小
            bigDom.style['width'] = dom?.current?.clientWidth + "px";
            bigDom.style['height'] = dom?.current?.clientHeight + "px";
            // 与css中width：200%，height：200%相对应，建议以后放大倍数为2n
            imgDom.style['left'] = -2 * left + "px";
            imgDom.style['top'] = -2 * top + "px";
        }
        // 4.鼠标松开事件
        eventDom.onmouseleave = function (ev: any) {
            const bigDom: any = document.getElementsByClassName('img-charts-big')[0];
            bigDom.style.display = 'none';
        }
    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgCharts} flex-box-center`}
            // @ts-ignore
            ref={dom}
        >
            {
                dataValue ?
                    <Image
                        src={dataValue}
                        alt="logo"
                        style={fontSize}
                    />
                    // <div className="img-box">
                    //     <img
                    //         src={dataValue}
                    //         id={`img-${id}`}
                    //         alt="logo"
                    //         style={fontSize}
                    //     />
                    //     <div
                    //         className="img-charts-event1"
                    //         id="img-charts-event1"
                    //     />
                    //     {/* <div className="img-charts-big">
                    //         <img src={dataValue} />
                    //     </div> */}
                    //     <div className="mask" />
                    // </div>
                    :
                    <Skeleton.Image
                        active={true}
                    />
            }
            <div className="mask"></div>
            {
                !!windowControl ?
                    <div className="preview-box flex-box-center">
                        <EyeOutlined
                            className='preview-icon'
                            style={{ fontSize: 18 }}
                            onClick={() => {
                                setContentList((prev: any) => {
                                    let arr = _.cloneDeep(prev);
                                    let sourceIndex = 0;
                                    arr.forEach((i: any, index: number) => {
                                        if (i.key === windowControl) {
                                            sourceIndex = index;
                                        }
                                    });
                                    const source = _.pullAt(arr, sourceIndex);
                                    arr = arr.concat(source);
                                    return arr;
                                })
                            }} />
                    </div>
                    : null
            }
        </div>
    );

};

export default ImgCharts;