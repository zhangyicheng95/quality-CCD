/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:02
 * @description: answer
 */
/**
 *  内容填充
 *  主要监听窗口变化 更改页面大小 保证不出现滚动条
 */
import React, { useState, useEffect } from 'react';
import './index.scss';

// export default function ScreenContents(props: any) {
const ScreenContents: React.FC<any> = (props: any) => {
    const { children } = props;

    const [styles, setStyles] = useState({});
    const [timer, setTimer] = useState(0);


    useEffect(() => {

        // * 默认缩放值
        const scale = {
            width: '1',
            height: '1',
        }
        // * 设计稿尺寸（px）
        const baseWidth = 1920
        const baseHeight = 1080

        // * 需保持的比例（默认1.77778）
        const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
        const calcRate = () => {

            // 等比缩放
            // 当前宽高比
            // const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
            // if (currentRate > baseProportion) {
            //     // 表示更宽
            //     scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
            //     scale.height = (window.innerHeight / baseHeight).toFixed(5)
            //     setStyles({
            //         transform: `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
            //     })
            // } else {
            //     // 表示更高
            //     scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
            //     scale.width = (window.innerWidth / baseWidth).toFixed(5)
            //     setStyles({
            //         transform: `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
            //     })
            // }

            // 横向纵向铺满
            setStyles({
                transform: `scale(${(window.innerWidth / 1920).toFixed(5)}, ${(window.innerHeight / 1080).toFixed(5)}) translate(-50%, -50%) translateZ(0)`
            })
        }

        calcRate()

        const resize = () => {
            console.log(33333)
            !timer && clearTimeout(timer)

            let timerIndex = setTimeout(() => {
                calcRate()
            }, 200)

            // setTimer( timerIndex )
        }

        // // 改变窗口大小重新绘制
        window.addEventListener('resize', resize)




    }, [])

    return (
        <div style={styles} className={`background`}>
            {children}
        </div>
    );
}

export default ScreenContents;