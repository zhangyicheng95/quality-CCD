import React, { useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from 'umi';
import styles from './index.less';

const ResponsiveGridLayout = WidthProvider(RGL);
interface Props {
  dragName?: any;
  margin?: any;
  list: any;
  layout: any;
  tabLength?: any;
  tabNum?: any;
  onChange?: any;
}

const CustomResizeHandle = React.forwardRef((props: any, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div className={`custom-handle flex-box`} ref={ref} {...restProps}>
      <div className="custom-resize-handle-component"></div>
    </div>
  );
});

const GridLayout: React.FC<Props> = (props: any) => {
  const {
    dragName = '.custom-drag',
    margin = [2, 2],
    tabLength,
    tabNum = 0,
    list = [],
    layout = [],
    onChange,
  } = props;

  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  //存储拖拽移动的位置到缓存
  const onLayoutChange = (data: any) => {
    const EUlayoutArr: any = [];
    var index = -1;
    data.forEach?.((item: any) => {
      const { i, x, y, w, h, minW, maxW, minH, maxH } = item;
      index++;
      EUlayoutArr[index] = { i, x, y, w, h, minW, maxW, minH, maxH };
    });
    onChange && onChange(EUlayoutArr);
  };
  const slider1 = list.filter((i: any) => i.key === 'slider-1');
  const bodyList = list.filter((i: any) => i.key !== 'slider-1');

  return (
    <>
      <div className={`flex-box ${styles.dashboardContent}`} id="dashboardContent">
        {
          // @ts-ignore
          <ResponsiveGridLayout
            className={dragName}
            // layouts={{
            //     lg: layout.filter(Boolean)
            // }}
            rowHeight={14}
            // layout={!!ifCanEdit ? layout : layout.filter((i: any) => (tabNum * 96 <= i.x) && (i.x < ((tabNum + 1) * 96)) && i.w > 0)}
            layout={layout.filter(Boolean)}
            cols={96 * (tabLength || 1)}
            // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            isResizable={ifCanEdit}
            isDraggable={ifCanEdit}
            isBounded={false}
            allowOverlap={true} // 覆盖
            preventCollision={false} // 防碰撞
            autoSize={true}
            onResizeStop={onLayoutChange}
            onDragStop={onLayoutChange}
            resizeHandles={['se']} // 'n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'
            resizeHandle={!!dragName ? <CustomResizeHandle /> : null}
            draggableHandle={dragName}
            margin={margin}
          >
            {/* {list.filter(Boolean)?.map?.((item: any) => {
              if (!!ifCanEdit) {
                return item;
              } else {
                const lay = layout.filter((i: any) => (tabNum * 96 <= i.x) && (i.x < ((tabNum + 1) * 96)) && i.w > 0 && item.key === i.i);
                if (!!lay && !!lay?.[0]) {
                  return item;
                }
                return null;
              }
            })?.filter(Boolean)} */}

            {bodyList.concat(slider1).filter(Boolean)}
          </ResponsiveGridLayout>
        }
      </div>
    </>
  );
};

export default connect(({ home }) => ({
  canvasLock: home.canvasLock || false,
}))(GridLayout);
