
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';

const ResponsiveGridLayout = WidthProvider(Responsive);
interface Props {
    id: any;
    dragName?: any;
    list: any;
    layout: any;
}
const CustomResizeHandle = React.forwardRef((props: any, ref) => {
    const { handleAxis, ...restProps } = props;
    return (
        <div
            className={`custom-handle flex-box`}
            ref={ref}
            {...restProps}
        >
            <div className="custom-resize-handle-component">

            </div>
        </div>
    );
});

const GridLayout: React.FC<Props> = (props: any) => {
    const { id, dragName = '.custom-drag', list, layout, } = props;

    //存储拖拽移动的位置到缓存
    const onLayoutChange = (layout: any) => {
        let EUlayoutArr: any = [];

        var index = -1;
        localStorage.removeItem(id);
        layout.forEach((item: any) => {
            const { i, x, y, w, h, minW, maxW, minH, maxH } = item;
            index++;
            EUlayoutArr[index] = { i, x, y, w, h, minW, maxW, minH, maxH }
        })
        localStorage.setItem(id, JSON.stringify(EUlayoutArr))
    }

    return (
        <>
            <div className={styles.dashboardContent}>
                {
                    // @ts-ignore
                    <ResponsiveGridLayout className="layout" layouts={{ lg: layout }} rowHeight={30}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        isResizable={true}
                        isDraggable={true}
                        isBounded={true}
                        allowOverlap={false} // 覆盖
                        onLayoutChange={onLayoutChange}
                        resizeHandles={['se']}  // 'n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'
                        resizeHandle={<CustomResizeHandle />}
                        draggableHandle={dragName}
                        margin={[8, 8]}
                    >
                        {
                            list.map((item: any) => {
                                return item
                            })
                        }
                    </ResponsiveGridLayout>
                }
            </div>
        </>
    );
}

export default GridLayout;

