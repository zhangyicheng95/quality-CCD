/**
 *@模块名称：useResize
 *
 *@创建人：ligaoming
 *
 *@作用：自定义hooks 获取窗口变化信息
 *
 *@date 2021/1/10
 *
 *@版权所有：
 */
import React, {useEffect, useState} from 'react';
import {debounce} from "@gaopeng123/utils";

const useResize = () => {
    const height = window.innerHeight;
    const [contentsHeight, setContentsHeight] = useState(height);
    useEffect(() => {
        const onResize = debounce(() => {
            setContentsHeight(window.innerHeight);
        }, 200, {leading: false});
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return contentsHeight
};

export default useResize;