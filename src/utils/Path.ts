/**
 * 处理路径相关函数
 */
export class Path {
    public static resolve(path1: string, path2: string) {
        if (!path1.startsWith('/') && !path1.startsWith('http')) path1 = `/${path1}`;
        if (path1.endsWith('/')) path1 = path1.substr(0, path1.length - 1);
        // 此时path1 后面就不是以'/'结尾 则要保证path2是以'/'开头
        if (!path2.startsWith('/')) path2 = `/${path2}`;
        return `${path1}${path2}`;
    }

    /**
     * 获取资源路径
     * @param url
     */
    public static getPathName = (url: string) => {
        // @ts-ignore
        if (!window.__POWERED_BY_QIANKUN__) {
            return  Path.resolve(window.location.pathname, url);
        }
        // return url;
        return Path.resolve(process.env.REACT_APP_QIANKUN_library as string, url);
    };
}
