import React, { useEffect, useMemo, useRef, useState } from 'react';
import Guides from '@scena/react-guides';
import { connect } from 'umi';
import styles from './index.less';
import MoveItem from './MoveabledItem/MoveItem';

interface Props {
  onChange?: any;
}

const ReactRuler: React.FC<Props> = (props: any) => {
  const { onChange } = props;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  const horizonalGuidesRef = useRef<any>();
  const verticalGuidesRef = useRef<any>();
  const ctrlRef = useRef<any>();
  const [boxSize, setBoxSize] = useState({
    top: 20,
    left: 100,
    right: 2020,
    bottom: 1100,
  });

  const onWheelScroll = (e: any) => {
    if (ctrlRef.current) {
      console.log(e);
    }
  };
  const onKeyDown = (e: any) => {
    const { ctrlKey } = e;
    if (ctrlKey) {
      ctrlRef.current = true;
    }
  };
  const onKeyUp = (e: any) => {
    ctrlRef.current = false;
  };
  useEffect(() => {
    document.addEventListener('wheel', onWheelScroll);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('wheel', onWheelScroll);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div
      className={styles.dashboardContent}
      id="moveableBox"
      onWheel={(e) => {
        const deltaX = e.deltaX;
        const deltaY = e.deltaY;
        const scrollX = horizonalGuidesRef.current.getRulerScrollPos() + deltaX;
        const scrollY = verticalGuidesRef.current.getRulerScrollPos() + deltaY;

        horizonalGuidesRef.current.scrollGuides(scrollY);
        verticalGuidesRef.current.scrollGuides(scrollX);
        horizonalGuidesRef.current.scroll(scrollX);
        verticalGuidesRef.current.scroll(scrollY);
      }}
    >
      <Guides
        ref={horizonalGuidesRef}
        className="ruler horizontal"
        type="horizontal"
        rulerStyle={{
          left: '30px',
          width: 'calc(100% - 30px)',
          height: '100%',
        }}
        defaultGuides={[boxSize.top, boxSize.bottom]}
        displayDragPos={true}
        displayGuidePos={true}
        useResizeObserver={true}
      />
      <Guides
        ref={verticalGuidesRef}
        className="ruler vertical"
        type="vertical"
        rulerStyle={{
          top: '30px',
          height: 'calc(100% - 30px)',
          width: '100%',
        }}
        defaultGuides={[boxSize.left, boxSize.right]}
        displayDragPos={true}
        displayGuidePos={true}
        useResizeObserver={true}
      />
      <div className="move-body-box">
        <MoveItem bounds={boxSize} />
      </div>
    </div>
  );
};

export default connect(({ home }) => ({
  canvasLock: home.canvasLock || false,
}))(ReactRuler);
