import { fabric } from 'fabric';

const extend = fabric.util.object.extend;

export const createFLineClass = () => {
  // @ts-ignore FLine
  fabric.FLine = fabric.util.createClass(fabric.Line, {
    type: 'f-line',

    padding: 6,

    borderColor: '#00000000',

    setStrokeWidth(w: any) {
      this.set('strokeWidth', w);
    },

    setStrokeDashArray(dashArray: any) {
      this.set('strokeDashArray', dashArray);
    },

    setStrokeLineCap(isRound: any) {
      this.set('strokeLineCap', isRound ? 'round' : 'butt');
    },

    toObject(propertiesToInclude: any) {
      return extend(this.callSuper('toObject', propertiesToInclude), { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 });
    },
  });

  // @ts-ignore FLine
  fabric.FLine.fromObject = (object: any, callback: any) => {
    function _callback(instance: any) {
      delete instance.points;
      callback && callback(instance);
    };
    const options = { ...object };
    options.points = [object.x1, object.y1, object.x2, object.y2];
    fabric.Object._fromObject('FLine', options, _callback, 'points');
  };
}