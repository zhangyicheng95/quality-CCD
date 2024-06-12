import React, { useMemo } from 'react';
//@ts-ignore
import SketchRuler from 'mb-sketch-ruler';
import { connect } from 'umi';
import styles from './index.less';

interface Props {
  onChange?: any;
}

const ReactRuler: React.FC<Props> = (props: any) => {
  const { onChange } = props;

  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  return (
    <SketchRuler
      thick={16}
      scale={2}
      width={582}
      height={482}
      startX={0}
      startY={0}
      shadow={{
        x: 200,
        y: 100,
        width: 200,
        height: 400,
      }}
      horLineArr={[1]}
      verLineArr={[2]}
      handleLine={(arr: any, vertical: any) => {
        console.log(arr, vertical);
      }}
      cornerActive={true}
      onCornerClick={(arr: any, vertical: any) => {
        console.log(arr, vertical);
      }}
    />
  );
};

export default connect(({ home }) => ({
  canvasLock: home.canvasLock || false,
}))(ReactRuler);
