import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { numToString } from '@/utils/utils';
import { Modal, Image, message } from 'antd';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ButtonImagesCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue = [], fontSize, } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            [
                { title: 'NG', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "red" },
                { title: 'OK', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "green" },
                { title: 'A-1', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "blue" },
                { title: 'A-2', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "yellow" },
            ],
            [
                { title: 'B-1', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "red" },
                { title: 'B-2', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "green" },
                { title: 'B-3', link: "https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast", color: "" },
            ],
        ];
    }

    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [chartSize, setChartSize] = useState(false);
    const dom = useRef<any>();

    useEffect(() => {
        let img: any = document.createElement('img');
        img.src = selectedItem.link;
        img.title = 'img.png';
        img.onload = (res: any) => {
            const { width = 1, height = 1 } = img;
            console.log(width / height);
            console.log(dom?.current?.clientWidth / dom?.current?.clientHeight);
            console.log((width / height) > (dom?.current?.clientWidth / dom?.current?.clientHeight));

            setChartSize((width / height) > (dom?.current?.clientWidth / dom?.current?.clientHeight));
            img = null;
        };

    }, [selectedItem.link, dom?.current?.clientWidth, dom?.current?.clientHeight]);

    return (
        <div
            id={`echart-${id}`}
            className={`flex-box-center ${styles.buttonImagesCharts}`}
            style={{ fontSize }}
        >
            <div className="img-button-charts-body">
                {
                    !!dataValue?.length ?
                        dataValue.map((left: any, lIndex: number) => {
                            return <div className="flex-box img-button-item-line" key={`left-${lIndex}`}>
                                {
                                    left.map((top: any, tIndex: number) => {
                                        const { title, color } = top;
                                        return <div
                                            className={`img-button-item-box`}
                                            key={`top-${tIndex}`}
                                            style={!!color ? { backgroundColor: color } : {}}
                                            onClick={() => {
                                                setSelectedItem(top);
                                                setVisible(true);
                                            }}
                                        >
                                            {title}
                                        </div>
                                    })
                                }
                            </div>
                        })
                        : null
                }
            </div>

            {
                !!visible ?
                    <Modal
                        title={`${selectedItem?.title} - 缺陷图片`}
                        wrapClassName="view-defect-modal"
                        centered
                        width="50vw"
                        open={!!visible}
                        maskClosable={false}
                        destroyOnClose
                        footer={null}
                        onCancel={() => {
                            setVisible(false);
                        }}
                    >
                        <div className="flex-box-center img-button-charts-body" ref={dom}>
                            <div className="img-box" style={
                                chartSize ?
                                    { width: '100%', height: 'auto' } :
                                    { width: 'auto', height: '100%' }
                            }>
                                <Image
                                    src={selectedItem?.link}
                                    alt={selectedItem?.title || 'logo'}
                                    style={
                                        chartSize ?
                                            { width: '100%', height: 'auto' } :
                                            { width: 'auto', height: '100%' }
                                    }
                                />
                            </div>
                        </div>
                    </Modal>
                    : null
            }
        </div>
    );

};

export default ButtonImagesCharts;