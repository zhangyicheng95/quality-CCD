import { fabric } from 'fabric';

export const createFImageClass = () => {
  // @ts-ignore custom image
  fabric.FImage = fabric.util.createClass(fabric.Group, {
    type: 'f-image',

    initialize(options: any, alreayGrouped = false) {
      const { image, imageBorder = {}, ...rest } = options;
      if (!image) {
        return;
      }
      image.set({
        originX: 'center',
        originY: 'center'
      });
      this.img = image;
      this.borderRect = this._createBorderRect(imageBorder);
      this.img.clipPath = this._createClipPath();
      this.callSuper('initialize', [this.img, this.borderRect], {
        borderColor: 'transparent',
        borderDashArray: null,
        borderScaleFactor: 2,
        padding: 0,
        subTargetCheck: false,
        imageBorder,
        ...rest
      }, alreayGrouped);
    },

    _createBorderRect({ stroke, strokeWidth, borderRadius }: any) {
      const width = this.img.getScaledWidth();
      const height = this.img.getScaledHeight();
      const options: any = {
        width,
        height,
        rx: borderRadius || 0,
        ry: borderRadius || 0,
        originX: 'center',
        originY: 'center',
        fill: '#00000000',
        paintFirst: 'fill'
      };
      if (stroke) options.stroke = stroke;
      if (strokeWidth) options.strokeWidth = strokeWidth;
      return new fabric.Rect(options);
    },

    _createClipPath() {
      const width = this.img.width;
      const height = this.img.height;

      return new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width,
        height,
        rx: this.borderRect.rx || 0,
        ry: this.borderRect.ry || 0
      });
    },

    setSrc(src: any, callback: any) {
      this.img.setSrc(src, () => {
        const width = this.img.getScaledWidth();
        const height = this.img.getScaledHeight();
        this.img.setCoords();
        this.borderRect.set({ width, height, dirty: true });
        this.img.set({
          clipPath: this._createClipPath(),
          dirty: true
        });
        this.addWithUpdate();
        callback && callback();
      });
    },

    getSrc() {
      return this.img.getSrc();
    },

    setBorder(b: any) {
      this.borderRect.set({
        stroke: b.stroke || null,
        strokeWidth: b.strokeWidth || 1,
        rx: b.borderRadius || 0,
        ry: b.borderRadius || 0,
        strokeDashArray: b.strokeDashArray || null
      });
      this.img.setCoords();
      this.img.set({
        clipPath: this._createClipPath(),
        dirty: true
      });
      this.imageBorder = { ...b };
      this.addWithUpdate();
    },

    getBorder() {
      return this.imageBorder;
    },

    // http://fabricjs.com/fabric-filters
    applyFilter(filter: any) {
      try {
        this.img.filters = filter ? [filter] : [];
        this.img.applyFilters();
      } catch (e) {
        console.log(e);
      }
    },

    applyFilterValue(prop: any, value: any) {
      const filter = this.getFilter();
      if (filter) {
        filter[prop] = value;
        this.img.filters = [filter];
        this.img.applyFilters();
      }
    },

    getFilter() {
      return this.img.filters[0];
    }
  });
  // @ts-ignore
  fabric.FImage.fromObject = (object: any, callback: any) => {
    const { objects, ...options } = object;
    const imgJson = { ...objects[0] };
    // @ts-ignore
    fabric.Image.fromObject(imgJson, (img: any) => {
      // @ts-ignore
      callback(new fabric.FImage({ image: img, ...options }, true));
    });
  }
}