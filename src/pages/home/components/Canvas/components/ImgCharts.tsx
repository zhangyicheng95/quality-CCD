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
    dataValue = 'https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast';
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [fontSize, setFontSize] = useState(1);
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
            setFontSize(width / height);
        };
    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);
    useEffect(() => {
        const eventDom: any = dom.current.querySelector('.ant-image-mask');
        const mask: any = dom?.current?.querySelector('.mask');
        if (!eventDom) return;
        eventDom.onmousemove = function (event: any) {
            // offsetX：鼠标坐标到元素的左侧的距离
            // offsetWidth 除了外边距(margin)以外，所有的宽度(高度)之和
            const { pageX = 0, pageY = 0, offsetX = 0, offsetY = 0 } = event;
            // let { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
            let { clientWidth: boxWidth, clientHeight: boxHeight } = eventDom;
            boxHeight = boxWidth / fontSize;

            let left = offsetX - mask?.offsetWidth / 2;
            // offsetY：鼠标坐标到元素的顶部的距离
            // offsetHeight:元素的像素高度 包含元素的垂直内边距和边框,水平滚动条的高度,且是一个整数
            let top = offsetY - mask?.offsetHeight / 2;
            // 约束范围,保证光标在div范围内，都是以父盒子div为参考对象的
            // 超出图片左侧
            if (!left || (left <= 0)) left = 0;
            // 超出图片右侧
            if ((left + mask?.offsetWidth) >= boxWidth) left = (boxWidth - mask?.offsetWidth);
            // 超出图片上侧
            if (!top || (top <= 0)) top = 0;
            // 超出图片下侧
            if ((top + mask?.offsetHeight) >= boxHeight) top = (boxHeight - mask?.offsetHeight);
            // 修改元素的left|top属性值
            // 遮罩层
            mask.style['left'] = left + "px";
            mask.style['top'] = top + "px";
            if (fontSize > 1) {
                // 图片比较宽
                mask.style['height'] = 12.5 / fontSize + "%";
            } else {
                // 图片比较高
                mask.style['width'] = 12.5 * fontSize + "%";
            }
            let bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
            let imgDom: any = document.getElementById(`img-charts-bigImg-${id}`);
            if (!imgDom) {
                bigDom = document.createElement('div');
                bigDom.className = `img-charts-big img-charts-big-${id}`;
                document.body.appendChild(bigDom);
                imgDom = document.createElement('img');
                imgDom.id = `img-charts-bigImg-${id}`;
                imgDom.src = dataValue;
                imgDom.style.width =
                    bigDom.appendChild(imgDom);
            } else {
                imgDom.src = dataValue;
                bigDom.style.display = 'block';
            }

            // 放大镜大小
            let bigWidth = boxWidth,
                bigHeight = boxHeight,
                scale = 1,
                maxSize = 400;
            if (boxWidth > maxSize) {
                if (boxHeight > maxSize) {
                    if (((maxSize) / boxWidth) <= ((maxSize) / boxHeight)) {
                        scale = (maxSize) / boxWidth;
                        bigWidth = maxSize;
                        bigHeight = boxHeight * scale;
                    } else {
                        scale = (maxSize) / boxHeight;
                        bigWidth = boxWidth * scale;
                        bigHeight = maxSize;
                    }
                } else {
                    scale = (maxSize) / boxWidth;
                    bigWidth = maxSize;
                    bigHeight = boxHeight * scale;
                }
            } else if (boxHeight > maxSize) {
                scale = (maxSize) / boxHeight;
                bigWidth = boxWidth * scale;
                bigHeight = maxSize;
            }
            console.log('盒子大小', boxWidth, boxHeight);
            console.log('放大镜大小', bigWidth, bigHeight);
            console.log('鼠标位置', left, top);
            bigDom.style['width'] = bigWidth + "px";
            bigDom.style['height'] = bigHeight + "px";
            const scaleSize = (fontSize > 1 ? (boxWidth / bigWidth) : (boxHeight / bigHeight));
            // 放大镜中的图片位置，与css中width：200%，height：200%相对应，建议以后放大倍数为2n
            imgDom.style['left'] = -4 * left + "px";
            imgDom.style['top'] = -4 * top + "px";
            if (fontSize > 1) {
                // 图片比较宽
                imgDom.style['width'] = boxWidth * 4 + 'px';
                imgDom.style['max-width'] = boxWidth * 4 + 'px';
                imgDom.style['height'] = 'auto';
            } else {
                // 图片比较高
                imgDom.style['height'] = boxHeight * 4 + 'px';
                imgDom.style['max-height'] = boxHeight * 4 + 'px';
                imgDom.style['width'] = 'auto';
            }
            // 放大镜的位置
            const offset = 20;
            if ((offsetX > boxWidth / 2) && (offsetY < boxHeight / 2)) {
                // 右上
                bigDom.style['left'] = pageX - offset - bigWidth + "px";
                bigDom.style['top'] = pageY + offset + "px";
            } else if ((offsetX > boxWidth / 2) && (offsetY > boxHeight / 2)) {
                // 右下
                bigDom.style['left'] = pageX - offset - bigWidth + "px";
                bigDom.style['top'] = pageY - offset - bigHeight + "px";
            } else if ((offsetX < boxWidth / 2) && (offsetY < boxHeight / 2)) {
                // 左上
                bigDom.style['left'] = pageX + offset + "px";
                bigDom.style['top'] = pageY + offset + "px";
            } else if ((offsetX < boxWidth / 2) && (offsetY > boxHeight / 2)) {
                // 左下
                bigDom.style['left'] = pageX + offset + "px";
                bigDom.style['top'] = pageY - offset - bigHeight + "px";
            }
        }
        // 4.鼠标松开事件
        eventDom.onmouseleave = function (ev: any) {
            const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
            bigDom.style.display = 'none';
        }
    }, [dataValue, id, fontSize, dom?.current?.clientWidth, dom?.current?.clientHeight]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgCharts} flex-box-center`}
            // @ts-ignore
            ref={dom}
        >
            {
                dataValue ?
                    <div className="img-box">
                        <Image
                            src={dataValue}
                            alt="logo"
                            style={
                                fontSize > 1 ?
                                    { width: '100%', height: 'auto' } :
                                    { width: 'auto', height: '100%' }
                            }
                        />
                        {/* <div
                            className="img-charts-event1"
                            id="img-charts-event1"
                        /> */}
                        {/* <div className="img-charts-big">
                            <img src={dataValue} />
                        </div> */}
                        <div className="mask" />
                    </div>
                    :
                    <Skeleton.Image
                        active={true}
                    />
            }
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