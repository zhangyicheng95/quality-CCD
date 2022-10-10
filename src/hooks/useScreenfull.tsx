/**
 *@模块名称：useScreenfull
 *
 *@创建人：ligaoming
 *
 *@作用：自定义hooks 获取全屏状态 并改变全屏状态
 *
 *@date 2021/1/10
 *
 *@版权所有：
 */
import React, {useEffect, useState, useRef} from 'react';
import {message} from 'antd';
import {FullscreenOutlined} from '@ant-design/icons';

const useScreenfull = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    /**
     * 非全屏模式 提示用户可进入全屏
     */
    useEffect(() => {
        if (!screenfull.isFullscreen) {
            message.open({
                type: 'info',
                content: <span className={`contents-screenfill-message`} onClick={() => {
                    if (!screenfull.isFullscreen) {
                        screenfull.request();
                        setIsFullscreen(true);
                    }
                }}>按<span className={`bulb-text`}>F11</span>或<span className={`bulb-text enter`}>点击</span>可进入全屏!</span>,
                duration: 3000, // 不生效
                icon: <FullscreenOutlined/>
            });
            /**
             * 销毁信息
             */
            setTimeout(() => {
                message.destroy();
            }, 3000);
        }
    }, []);
    return isFullscreen
};

export default useScreenfull;
