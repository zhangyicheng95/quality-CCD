import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Image, message, Modal, Skeleton } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import {
    BlockOutlined, DownloadOutlined, ExpandOutlined, LeftCircleOutlined,
    RightCircleOutlined, SwapOutlined, ZoomInOutlined
} from '@ant-design/icons';
import { numToString } from '@/utils/utils';
import html2canvas from 'html2canvas';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id } = props;
    let {
        defaultImg, dataValue = '', magnifier = false,
        comparison, magnifierSize = 4, markNumber, markNumberLeft = 6, markNumberTop = 24,
        ifShowHeader,
    } = data;

    if (process.env.NODE_ENV === 'development') {
        // dataValue = 'https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast';
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const urlList = useRef<any>([]);
    const [chartSize, setChartSize] = useState(false);
    const [selectedNum, setSelectedNum] = useState(0);
    const [imgVisible, setImgVisible] = useState(false);
    const [visibleDirection, setVisibleDirection] = useState<any>('column');
    const [visible, setVisible] = useState(false);
    const [magnifierVisible, setMagnifierVisible] = useState(false);

    const dom = useRef<any>();
    useLayoutEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || "[]");
            urlList.current = list;
        } catch (err) {
            console.log(err);
        }

        function onKeyUp(e: any) {
            if (e.keyCode === 27) {
                // 27是esc
                setMagnifierVisible(false);
            }
        };
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window?.removeEventListener?.("keyup", onKeyUp);
        }
    }, []);
    useEffect(() => {
        if (!_.isString(dataValue)) {
            message.error('图片组件数据格式不正确，请检查');
            console.log('ImgCharts:', dataValue);
            return;
        }
        const localhostList = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || "[]");
        if (!dataValue) {
            dataValue = localhostList?.[localhostList?.length - 1] || '';
        }
        let list = Array.from(new Set(urlList.current.concat(dataValue)));
        localStorage.setItem(`img-list-${params.id}-${id}`, JSON.stringify(list));
        setSelectedNum(list?.length - 1);
        urlList.current = list.slice(list.length - 100);

    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight, comparison]);
    useEffect(() => {
        let img: any = document.createElement('img');
        img.src = urlList.current?.[selectedNum];
        img.title = 'img.png';
        img.onload = (res: any) => {
            const { width = 1, height = 1 } = img;
            setChartSize((width / height) > (dom?.current?.clientWidth / dom?.current?.clientHeight));
            img = null;
        };
    }, [selectedNum]);
    useEffect(() => {
        if (!magnifier && !magnifierVisible) {
            return;
        }
        if (!dataValue) {
            const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || "[]");
            dataValue = list?.[list?.length - 1] || '';
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
            // if (chartSize > 1) {
            //     // 图片比较宽
            //     mask.style['height'] = 50 / size / chartSize + "%";
            // } else {
            //     // 图片比较高
            //     mask.style['width'] = 50 / size * chartSize + "%";
            // }
            let bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
            let imgDom: any = document.getElementById(`img-charts-bigImg-${id}`);
            if (!imgDom) {
                bigDom = document.createElement('div');
                bigDom.className = `img-charts-big img-charts-big-${id}`;
                document.body.appendChild(bigDom);
                imgDom = document.createElement('img');
                imgDom.id = `img-charts-bigImg-${id}`;
                imgDom.src = urlList.current?.[selectedNum] || dataValue || defaultImg;
                bigDom.appendChild(imgDom);
            } else {
                imgDom.src = urlList.current?.[selectedNum] || dataValue || defaultImg;
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
                if (!!bigDom) {
                    bigDom.style.display = 'none';
                }
            }
        }
        const domBox = dom.current.querySelector('.img-box');
        if (!!domBox) {
            domBox.onmouseleave = function (ev: any) {
                const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
                if (!!bigDom) {
                    bigDom.style.display = 'none';
                }
            }
        }
    }, [
        magnifierVisible,
        // magnifier, magnifierSize, dataValue, id, chartSize,
        // dom?.current?.clientWidth, dom?.current?.clientHeight
    ]);

    return (
        <div
            id={`echart-${id}`}
            className={`flex-box ${styles.imgCharts}`}
            ref={dom}
        >
            {
                markNumber ?
                    <div className="flex-box img-box-mark-top">
                        {
                            Array.from({ length: markNumberTop || 24 }).map((item: any, index: number) => {
                                return <div className="flex-box-center img-box-mark-item" key={`img-box-mark-top-${index}`}>
                                    {index + 1}
                                </div>
                            })
                        }
                    </div>
                    : null
            }
            <div className="flex-box img-box-mark-body" style={markNumber ? { height: 'calc(100% - 20px)' } : { height: '100%' }}>
                {
                    markNumber ?
                        <div className="flex-box img-box-mark-left">
                            {
                                Array.from({ length: markNumberLeft || 6 }).map((item: any, index: number) => {
                                    return <div className="flex-box-center img-box-mark-item" key={`img-box-mark-left-${index}`}>
                                        {numToString(index + 1)}
                                    </div>
                                })
                            }
                        </div>
                        : null
                }
                <div className={`flex-box-center img-box-mark-right`} style={markNumber ? { width: 'calc(100% - 20px)' } : { width: '100%' }}>
                    {
                        (!!dataValue || !!defaultImg) ?
                            <Fragment>
                                {
                                    (magnifier || magnifierVisible) ?
                                        <div className="img-box" style={Object.assign({},
                                            chartSize ?
                                                { width: '100%', height: 'auto' } :
                                                { width: 'auto', height: '100%' },
                                        )}>
                                            <div
                                                className="ant-image-mask"
                                                style={
                                                    chartSize ?
                                                        { width: '100%', height: 'auto' } :
                                                        { width: 'auto', height: '100%' }
                                                }
                                            />
                                            <Image
                                                src={urlList.current?.[selectedNum] || dataValue || defaultImg}
                                                alt="logo"
                                                style={
                                                    chartSize ?
                                                        { width: '100%', height: 'auto' } :
                                                        { width: 'auto', height: '100%' }
                                                }
                                                preview={false}
                                            />
                                            <div className="mask" />
                                        </div>
                                        :
                                        <div className="img-box" style={Object.assign({},
                                            chartSize ?
                                                { width: '100%', height: 'auto' } :
                                                { width: 'auto', height: '100%' },
                                        )}>
                                            <Image
                                                src={urlList.current?.[selectedNum] || dataValue || defaultImg}
                                                alt="logo"
                                                style={
                                                    chartSize ?
                                                        { width: '100%', height: 'auto' } :
                                                        { width: 'auto', height: '100%' }
                                                }
                                                preview={false}
                                            />
                                        </div>
                                }
                                <div className="flex-box img-box-btn-box" style={!!ifShowHeader ? { display: 'flex', top: '-26px' } : {}}>
                                    <div
                                        className={`${(selectedNum === 0) ? 'greyColorStyle' : ''} prev-btn`}
                                        onClick={() => setSelectedNum((pre: number) => {
                                            if (pre - 1 >= 0) {
                                                return pre - 1;
                                            }
                                            return pre;
                                        })}
                                    >
                                        {'< '}
                                    </div>
                                    {`${selectedNum + 1}/${urlList.current?.length}`}
                                    <div
                                        className={`next-btn ${(selectedNum + 1 === urlList.current.length) ? 'greyColorStyle' : ''}`}
                                        onClick={() => setSelectedNum((pre: number) => {
                                            if (pre + 1 < urlList.current.length) {
                                                return pre + 1;
                                            }
                                            return pre;
                                        })}
                                    >
                                        {' >'}
                                    </div>
                                    <DownloadOutlined className='img-box-btn-item' onClick={() => {
                                        const imgBox = dom.current?.querySelector('.ant-image-img');
                                        html2canvas(imgBox, {
                                            scale: 1,
                                            useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
                                            allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
                                        }).then((canvas: any) => {
                                            let imageDataURL = canvas.toDataURL('image/png', { quality: 1 });
                                            var link = document.createElement('a');
                                            link.href = imageDataURL;
                                            link.download = `output.png`;
                                            link.click();
                                        });
                                    }} />
                                    <ZoomInOutlined
                                        className={`img-box-btn-item ${magnifierVisible ? "img-box-btn-item-selected" : ""}`}
                                        onClick={() => setMagnifierVisible((prev: any) => !prev)}
                                    />
                                    <ExpandOutlined className='img-box-btn-item' onClick={() => setVisible(true)} />
                                </div>
                            </Fragment>
                            :
                            <Skeleton.Image
                                active={true}
                            />
                    }
                </div>
                <div style={{ display: 'none' }}>
                    <Image.PreviewGroup
                        preview={{
                            visible,
                            current: urlList.current.length - 1,
                            onVisibleChange: vis => setVisible(vis)
                        }}
                    >
                        {
                            (urlList.current || []).map((url: string) => {
                                return <Image src={url} alt={url} key={url} />
                            })
                        }
                    </Image.PreviewGroup>
                </div>
            </div>
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
                                    src={urlList.current?.[selectedNum] || ''}
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
                                    disabled={selectedNum + 1 === urlList.current.length}
                                    icon={<RightCircleOutlined className='btn-icon' />}
                                    className='next-btn'
                                    onClick={() => setSelectedNum((pre: number) => {
                                        if (pre + 1 < urlList.current.length) {
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