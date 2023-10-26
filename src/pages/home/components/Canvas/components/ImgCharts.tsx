import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Image, message, Modal, Skeleton } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { BlockOutlined, EyeOutlined, LeftCircleOutlined, RightCircleOutlined, SwapOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id } = props;
    let {
        defaultImg, dataValue = '', windowControl, setContentList, magnifier = false,
        comparison, magnifierSize = 4,
    } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = 'https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast';
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [fontSize, setFontSize] = useState(1);
    const [urlList, setUrlList] = useState<any>([]);
    const [selectedNum, setSelectedNum] = useState(0);
    const [imgVisible, setImgVisible] = useState(false);
    const [visibleDirection, setVisibleDirection] = useState<any>('column');
    const [visible, setVisible] = useState(false);

    const dom = useRef<any>();
    useLayoutEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || "[]");
            setUrlList(list);
        } catch (err) {
            console.log(err);
        }
    }, []);
    useEffect(() => {
        if (!_.isString(dataValue)) {
            message.error('图片组件数据格式不正确，请检查');
            console.log('ImgCharts:', dataValue);
            return;
        }
        const img = document.createElement('img');
        img.src = dataValue;
        img.title = 'img.png';
        img.onload = (res: any) => {
            const { width = 1, height = 1 } = img;
            setFontSize(width / height);
        };
        setUrlList((pre: any) => {
            let list = Array.from(new Set(pre.concat(dataValue)));
            localStorage.setItem(`img-list-${params.id}-${id}`, JSON.stringify(list));
            return list.slice(list.length - 99);
        });
    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight, comparison]);
    useEffect(() => {
        if (!magnifier) {
            return;
        }
        const size = magnifierSize || 4;
        const eventDom: any = dom.current.querySelector('.ant-image-mask');
        const ImageDom: any = dom.current.querySelector('.ant-image-img');
        const mask: any = dom?.current?.querySelector('.mask');
        if (!eventDom) return;
        eventDom.onmousemove = function (event: any) {
            // offsetX：鼠标坐标到元素的左侧的距离
            // offsetWidth 除了外边距(margin)以外，所有的宽度(高度)之和
            const { pageX = 0, pageY = 0, offsetX = 0, offsetY = 0 } = event;
            // let { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
            let { clientWidth: boxWidth, clientHeight: boxHeight } = ImageDom;

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
            // if (fontSize > 1) {
            //     // 图片比较宽
            //     mask.style['height'] = 50 / size / fontSize + "%";
            // } else {
            //     // 图片比较高
            //     mask.style['width'] = 50 / size * fontSize + "%";
            // }
            let bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
            let imgDom: any = document.getElementById(`img-charts-bigImg-${id}`);
            if (!imgDom) {
                bigDom = document.createElement('div');
                bigDom.className = `img-charts-big img-charts-big-${id}`;
                document.body.appendChild(bigDom);
                imgDom = document.createElement('img');
                imgDom.id = `img-charts-bigImg-${id}`;
                imgDom.src = dataValue;
                bigDom.appendChild(imgDom);
            } else {
                imgDom.src = dataValue;
                bigDom.style.display = 'block';
            }

            // 放大镜大小
            let bigWidth = mask.clientWidth * size,
                bigHeight = mask.clientHeight * size;

            bigDom.style['width'] = bigWidth + "px";
            bigDom.style['height'] = bigHeight + "px";
            // 放大镜中的图片位置，与css中width：200%，height：200%相对应，建议以后放大倍数为2n
            imgDom.style['width'] = boxWidth * size + "px";
            imgDom.style['height'] = boxHeight * size + "px";
            imgDom.style['left'] = -1 * size * left + "px";
            imgDom.style['top'] = -1 * size * top + "px";
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
        // 4.鼠标离开事件
        if (!!eventDom) {
            eventDom.onmouseleave = function (ev: any) {
                const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
                bigDom.style.display = 'none';
            }
        }
        const domBox = dom.current.querySelector('.img-box');
        if (!!domBox) {
            domBox.onmouseleave = function (ev: any) {
                const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
                bigDom.style.display = 'none';
            }
        }
    }, [
        magnifier, magnifierSize, dataValue, id, fontSize,
        dom?.current?.clientWidth, dom?.current?.clientHeight
    ]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgCharts} flex-box-center`}
            // @ts-ignore
            ref={dom}
        >
            {
                (!!dataValue || !!defaultImg) ?
                    (magnifier ?
                        <div className="img-box">
                            <Image
                                src={dataValue || defaultImg}
                                alt="logo"
                                style={
                                    fontSize > 1 ?
                                        { width: '100%', height: 'auto' } :
                                        { width: 'auto', height: '100%' }
                                }
                                preview={{ visible: false }}
                                onClick={() => setVisible(true)}
                            />
                            <div className="mask" />
                        </div>
                        :
                        <Image
                            src={dataValue || defaultImg}
                            alt="logo"
                            style={
                                fontSize > 1 ?
                                    { width: '100%', height: 'auto' } :
                                    { width: 'auto', height: '100%' }
                            }
                            preview={{ visible: false }}
                            onClick={() => setVisible(true)}
                        />)
                    :
                    <Skeleton.Image
                        active={true}
                    />
            }
            <div style={{ display: 'none' }}>
                <Image.PreviewGroup
                    preview={{
                        visible,
                        current: urlList.length - 1,
                        onVisibleChange: vis => setVisible(vis)
                    }}
                >
                    {
                        (urlList || []).map((url: string) => {
                            return <Image src={url} alt={url} key={url} />
                        })
                    }
                </Image.PreviewGroup>
            </div>
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
            {
                (_.isBoolean(comparison) ? comparison : true) ?
                    <div className="contrast-box flex-box" onClick={() => setImgVisible(true)}>
                        <BlockOutlined />对比
                    </div>
                    : null
            }
            {
                !!imgVisible ?
                    <Modal
                        title={<div className='flex-box image-contrast-modal-title'>
                            模板对比
                            <Button
                                icon={<SwapOutlined />}
                                className="image-contrast-modal-title-btn"
                                onClick={() => setVisibleDirection((pre: string) => pre === 'row' ? "column" : "row")}
                            />
                        </div>}
                        wrapClassName="image-contrast-modal"
                        centered
                        width="90vw"
                        open={!!imgVisible}
                        footer={null}
                        onCancel={() => setImgVisible(false)}
                        destroyOnClose={true}
                    >
                        <div className="flex-box image-contrast-modal-body" style={{
                            flexDirection: visibleDirection
                        }}>
                            <div className={`image-contrast-modal-body-top ${visibleDirection}`}>
                                <Image
                                    src={defaultImg}
                                    alt="logo"
                                    className='image-contrast-modal-body-img'
                                />
                            </div>
                            <div className={`flex-box image-contrast-modal-body-bottom ${visibleDirection}`}>
                                <Image
                                    src={urlList[selectedNum] || ''}
                                    alt="logo"
                                    className='image-contrast-modal-body-img'
                                />
                                <Button
                                    type="text"
                                    disabled={selectedNum === 0}
                                    icon={<LeftCircleOutlined className='btn-icon' />}
                                    className='prev-btn'
                                    onClick={() => setSelectedNum((pre: number) => {
                                        if (pre - 1 >= 0) {
                                            return pre - 1;
                                        }
                                        return pre;
                                    })}
                                />
                                <Button
                                    type="text"
                                    disabled={selectedNum + 1 === urlList.length}
                                    icon={<RightCircleOutlined className='btn-icon' />}
                                    className='next-btn'
                                    onClick={() => setSelectedNum((pre: number) => {
                                        if (pre + 1 < urlList.length) {
                                            return pre + 1;
                                        }
                                        return pre;
                                    })}
                                />
                            </div>
                        </div>
                    </Modal>
                    : null
            }
        </div>
    );

};

export default ImgCharts;