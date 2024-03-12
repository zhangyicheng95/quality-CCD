import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Image, message, Modal, Skeleton } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import {
  BlockOutlined,
  DownloadOutlined,
  ExpandOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import html2canvas from 'html2canvas';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ImgCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    defaultImg,
    dataValue = '',
    showImgList,
    comparison,
    magnifierSize = 6,
    markNumber,
    ifShowHeader,
    magnifierWidth,
    magnifierHeight,
  } = data;

  if (process.env.NODE_ENV === 'development' && !dataValue) {
    dataValue =
      'https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast';
  }
  const ifCanEdit = useMemo(() => {
    return location.hash.indexOf('edit') > -1;
  }, [location.hash]);
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  // 变量
  let x = 0,
    y = 0,
    scale = 1,
    ulWidth = 0,
    ulHeight = 0,
    minScale = 1,
    maxScale = magnifierSize; // 用于计算diff
  let isDown = false, // 按下标识
    diff = { x: 0, y: 0 }, // 相对于上一次lastPointermove移动差值
    lastPointermove = { x: 0, y: 0 }; // 用于计算diff

  const dom = useRef<any>();
  const imgBoxRef = useRef<any>();
  const urlList = useRef<any>([]);
  const [chartSize, setChartSize] = useState(false);
  const [selectedNum, setSelectedNum] = useState(0);
  const [imgVisible, setImgVisible] = useState(false);
  const [visibleDirection, setVisibleDirection] = useState<any>('column');
  const [visible, setVisible] = useState(false);
  const [magnifierVisible, setMagnifierVisible] = useState(false);

  useLayoutEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || '[]');
      urlList.current = list;
    } catch (err) {
      console.log(err);
    }

    function onKeyUp(e: any) {
      if (e.keyCode === 27) {
        // 27是esc
        setMagnifierVisible(false);
        isDown = false;
      }
    }
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window?.removeEventListener?.('keyup', onKeyUp);
    };
  }, []);
  useEffect(() => {
    if (!_.isString(dataValue)) {
      message.error('图片组件数据格式不正确，请检查');
      console.log('ImgCharts:', dataValue);
      return;
    }
    const localhostList = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || '[]');
    if (!dataValue) {
      dataValue = localhostList?.[localhostList?.length - 1] || '';
    }
    let list = Array.from(new Set(urlList.current.concat(dataValue)));
    if (list?.length >= 101) {
      list = list.slice(-95);
      localStorage.setItem(`img-list-${params.id}-${id}`, JSON.stringify(list));
      setSelectedNum(list?.length - 1);
      urlList.current = list;
    } else {
      localStorage.setItem(`img-list-${params.id}-${id}`, JSON.stringify(list));
      setSelectedNum(list?.length - 1 >= 99 ? 99 : list?.length - 1);
      urlList.current = list.slice(-100);
    }
  }, [dataValue, comparison]);
  useEffect(() => {
    let img: any = document.createElement('img');
    img.src = urlList.current?.[selectedNum] || dataValue;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setChartSize(width / height > dom?.current?.clientWidth / dom?.current?.clientHeight);
      if (ifCanEdit) return;
      const ul = imgBoxRef.current;
      if (!ul?.clientWidth) return;
      // 变量
      x = 0;
      y = 0;
      scale = 1;
      ulWidth = 0;
      ulHeight = 0;
      minScale = 1;
      maxScale = magnifierSize; // 用于计算diff

      if (width / height > dom?.current?.clientWidth / dom?.current?.clientHeight) {
        ulWidth = dom?.current?.clientWidth;
        ulHeight = (dom?.current?.clientWidth / width) * height;
      } else {
        ulWidth = (dom?.current?.clientHeight / height) * width;
        ulHeight = dom?.current?.clientHeight;
      }
      ul.style.width = ulWidth + 'px';
      ul.style.height = ulHeight + 'px';
      ul.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      // 滚轮缩放、放大逻辑
      ul.addEventListener('wheel', function (e: any) {
        e.preventDefault();
        let ratio = 1.1;
        // 缩小
        if (e.deltaY > 0) {
          ratio = 1 / 1.1;
        }
        // 限制缩放倍数
        const onscale = scale * ratio;
        if (onscale > maxScale) {
          ratio = maxScale / scale;
          scale = maxScale;
        } else if (onscale < minScale) {
          ratio = minScale / scale;
          scale = minScale;
        } else {
          scale = onscale;
        }
        const origin = {
          x: (ratio - 1) * ulWidth * 0.5,
          y: (ratio - 1) * ulHeight * 0.5,
        };
        // 计算偏移量
        const marginLeft = e.pageX - e.offsetX - (dom.current.clientWidth - ulWidth) * 0.5;
        const kongbaichuX = (dom.current.clientWidth - ulWidth) * 0.5;
        const marginTop = e.pageY - e.offsetY - (dom.current.clientHeight - ulHeight) * 0.5;
        const kongbaichuY = (dom.current.clientHeight - ulHeight) * 0.5;
        x -= (ratio - 1) * (e.clientX - x - marginLeft - kongbaichuX) - origin.x;
        y -= (ratio - 1) * (e.clientY - y - marginTop - kongbaichuY) - origin.y;
        let offsetX = Math.min(
          Math.max(x, ulWidth - (ulWidth * (scale + 1)) / 2),
          (ulWidth * (scale - 1)) / 2,
        );
        let offsetY = Math.min(
          Math.max(y, ulHeight - (ulHeight * (scale + 1)) / 2),
          (+ulHeight * (scale - 1)) / 2,
        );
        x = offsetX;
        y = offsetY;
        ul.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
      });

      img = null;
    };
  }, [selectedNum, dom?.current?.clientWidth, dom?.current?.clientHeight]);
  useEffect(() => {
    if (!dataValue) {
      const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || '[]');
      dataValue = list?.[list?.length - 1] || '';
    }
    const size = magnifierSize || 4;
    const eventDom: any = dom.current.querySelector('.ant-image-mask');
    const ImageDom: any = dom.current.querySelector('.ant-image-img');
    const mask: any = dom?.current?.querySelector('.mask');
    if (!eventDom) return;

    //申明全局变量
    var timeStart: any = 0,
      timeEnd: any = 0,
      time: any = 0;
    //获取此刻时间
    function getTimeNow() {
      var now = new Date();
      return now.getTime();
    }
    const ul: any = imgBoxRef.current;
    eventDom.onmousedown = function (e: any) {
      if (scale === 1) {
        mask.style.display = 'block';
        //获取鼠标按下时的时间
        timeStart = getTimeNow();
        //setInterval会每100毫秒执行一次，也就是每100毫秒获取一次时间
        time = setInterval(function () {
          timeEnd = getTimeNow();
          //如果此时检测到的时间与第一次获取的时间差有300毫秒
          eventDom.onmousemove = function (event: any) {
            // offsetX：鼠标坐标到元素的左侧的距离
            // offsetWidth 除了外边距(margin)以外，所有的宽度(高度)之和
            const { pageX = 0, pageY = 0, offsetX = 0, offsetY = 0 } = event;
            // let { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
            let { clientWidth: boxWidth, clientHeight: boxHeight } = ImageDom;
            let left = offsetX - mask?.offsetWidth / 2;
            // offsetY：鼠标坐标到元素的顶部的距离
            // offsetHeight:元素的像素高度 包含元素的垂直内边距和边框,水平滚动条的高度,且是一个整数
            let top = offsetY - mask?.offsetHeight / 2;
            // 约束范围,保证光标在div范围内，都是以父盒子div为参考对象的
            // 超出图片左侧
            if (!left || left <= 0) left = 0;
            // 超出图片右侧
            if (left + mask?.offsetWidth >= boxWidth) left = boxWidth - mask?.offsetWidth;
            // 超出图片上侧
            if (!top || top <= 0) top = 0;
            // 超出图片下侧
            if (top + mask?.offsetHeight >= boxHeight) top = boxHeight - mask?.offsetHeight;
            // 修改元素的left|top属性值
            // 遮罩层
            mask.style['left'] = left + 'px';
            mask.style['top'] = top + 'px';
            let bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
            let imgDom: any = document.getElementById(`img-charts-bigImg-${id}`);
            if (!imgDom) {
              bigDom = document.createElement('div');
              bigDom.className = `img-charts-big img-charts-big-${id}`;
              document.body.appendChild(bigDom);
              imgDom = document.createElement('img');
              imgDom.id = `img-charts-bigImg-${id}`;
              imgDom.src = urlList.current?.[selectedNum] || dataValue || defaultImg;
              bigDom.appendChild(imgDom);
            } else {
              imgDom.src = urlList.current?.[selectedNum] || dataValue || defaultImg;
              bigDom.style.display = 'block';
            }
            // 放大镜大小
            let bigWidth = mask.clientWidth * size,
              bigHeight = mask.clientHeight * size;
            bigDom.style['width'] = bigWidth + 'px';
            bigDom.style['height'] = bigHeight + 'px';
            // 放大镜中的图片位置，与css中width：200%，height：200%相对应，建议以后放大倍数为2n
            imgDom.style['width'] = boxWidth * size + 'px';
            imgDom.style['height'] = boxHeight * size + 'px';
            imgDom.style['left'] = -1 * size * left + 'px';
            imgDom.style['top'] = -1 * size * top + 'px';
            // 放大镜的位置
            const offset = 20;
            if (offsetX > boxWidth / 2 && offsetY < boxHeight / 2) {
              // 右上
              bigDom.style['left'] = pageX - offset - bigWidth + 'px';
              bigDom.style['top'] = pageY + offset + 'px';
            } else if (offsetX > boxWidth / 2 && offsetY > boxHeight / 2) {
              // 右下
              bigDom.style['left'] = pageX - offset - bigWidth + 'px';
              bigDom.style['top'] = pageY - offset - bigHeight + 'px';
            } else if (offsetX < boxWidth / 2 && offsetY < boxHeight / 2) {
              // 左上
              bigDom.style['left'] = pageX + offset + 'px';
              bigDom.style['top'] = pageY + offset + 'px';
            } else if (offsetX < boxWidth / 2 && offsetY > boxHeight / 2) {
              // 左下
              bigDom.style['left'] = pageX + offset + 'px';
              bigDom.style['top'] = pageY - offset - bigHeight + 'px';
            }
          };
          // 4.鼠标离开事件
          if (!!eventDom) {
            eventDom.onmouseleave = function (ev: any) {
              const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
              if (!!bigDom) {
                bigDom.style.display = 'none';
              }
            };
          }
          if (timeEnd - timeStart > 300) {
            //便不再继续重复此函数 （clearInterval取消周期性执行）
            clearInterval(time);
          }
        }, 100);
      } else {
        // e.preventDefault();
        // e.stopPropagation();
        isDown = true;
        lastPointermove = { x: e.clientX, y: e.clientY };
      }
    };
    if (!ul) return;
    // 绑定鼠标移动
    ul.onmousemove = function (e: any) {
      if (!ul?.clientWidth || scale === 1) return;
      e.preventDefault();
      e.stopPropagation();
      if (isDown) {
        const current1 = { x: e.clientX, y: e.clientY };
        diff.x = current1.x - lastPointermove.x;
        diff.y = current1.y - lastPointermove.y;
        lastPointermove = { x: current1.x, y: current1.y };
        x += diff.x;
        y += diff.y;
        //边界判断
        let offsetX = Math.min(
          Math.max(x, ulWidth - (ulWidth * (scale + 1)) / 2),
          (+ulWidth * (scale - 1)) / 2,
        );
        let offsetY = Math.min(
          Math.max(y, ulHeight - (ulHeight * (scale + 1)) / 2),
          (+ulHeight * (scale - 1)) / 2,
        );
        ul.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
      }
    };
    eventDom.onmouseup = function () {
      mask.style.display = 'none';
      //如果按下时间不到300毫秒便弹起，
      clearInterval(time);
      const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
      if (!!bigDom) {
        bigDom.style.display = 'none';
      }
      eventDom.onmousemove = null;
      isDown = false;
    };
    const domBox = imgBoxRef.current;
    if (!!domBox) {
      domBox.onmouseleave = function (ev: any) {
        const bigDom: any = document.getElementsByClassName(`img-charts-big-${id}`)[0];
        if (!!bigDom) {
          bigDom.style.display = 'none';
        }
      };
    }
  }, [
    magnifierVisible,
    selectedNum,
    dataValue,
    // magnifierSize, dataValue, id, chartSize,
    // dom?.current?.clientWidth, dom?.current?.clientHeight
  ]);
  const onPrev = () => {
    setSelectedNum((pre: number) => {
      if (pre - 1 >= 0) {
        return pre - 1;
      }
      return pre;
    });
  };
  const onNext = () => {
    setSelectedNum((pre: number) => {
      if (pre + 1 < urlList.current.length) {
        return pre + 1;
      }
      return pre;
    });
  };
  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.imgCharts}`}>
      <div
        className="flex-box img-box-mark-body"
        style={showImgList ? { height: 'calc(100% - 50px)' } : { height: '100%' }}
        ref={dom}
      >
        <div
          className={`flex-box-center img-box-mark-right`}
          style={markNumber ? { width: 'calc(100% - 20px)' } : { width: '100%' }}
        >
          {!!urlList.current?.[selectedNum] || !!dataValue || !!defaultImg ? (
            <Fragment>
              <div
                className="img-box"
                style={
                  chartSize ? { width: '100%', height: 'auto' } : { width: 'auto', height: '100%' }
                }
                ref={imgBoxRef}
              >
                <div
                  className="ant-image-mask"
                  style={
                    chartSize
                      ? { width: '100%', height: 'auto' }
                      : { width: 'auto', height: '100%' }
                  }
                />
                <Image
                  src={urlList.current?.[selectedNum] || dataValue || defaultImg}
                  alt="logo"
                  style={
                    chartSize
                      ? { width: '100%', height: 'auto' }
                      : { width: 'auto', height: '100%' }
                  }
                  preview={false}
                />
                <div
                  className="mask"
                  style={
                    !!magnifierWidth && !!magnifierHeight
                      ? {
                          width: magnifierWidth,
                          height: magnifierHeight,
                        }
                      : {}
                  }
                />
              </div>
              <div
                className="flex-box img-box-btn-box"
                style={!!ifShowHeader ? { display: 'flex', top: '-26px' } : {}}
              >
                <div
                  className={`${selectedNum === 0 ? 'greyColorStyle' : ''} prev-btn`}
                  onClick={() => onPrev()}
                >
                  {'< '}
                </div>
                {`${selectedNum + 1}/${urlList.current?.length}`}
                <div
                  className={`next-btn ${
                    selectedNum + 1 === urlList.current.length ? 'greyColorStyle' : ''
                  }`}
                  onClick={() => onNext()}
                >
                  {' >'}
                </div>
                <DownloadOutlined
                  className="img-box-btn-item"
                  onClick={() => {
                    const imgBox = dom.current?.querySelector('.ant-image-img');
                    html2canvas(imgBox, {
                      scale: 1,
                      useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
                      allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
                    }).then((canvas: any) => {
                      let imageDataURL = canvas.toDataURL('image/png', { quality: 1 });
                      var link = document.createElement('a');
                      link.href = imageDataURL;
                      link.download = `output.png`;
                      link.click();
                    });
                  }}
                />
                {/* <ZoomInOutlined
                                        className={`img-box-btn-item ${magnifierVisible ? "img-box-btn-item-selected" : ""}`}
                                        onClick={() => setMagnifierVisible((prev: any) => !prev)}
                                    /> */}
                <ExpandOutlined className="img-box-btn-item" onClick={() => setVisible(true)} />
              </div>
            </Fragment>
          ) : (
            <Skeleton.Image active={true} />
          )}
        </div>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible,
              current: urlList.current.length - 1,
              onVisibleChange: (vis) => setVisible(vis),
            }}
          >
            {(urlList.current || []).map((url: string) => {
              return <Image src={url} alt={url} key={url} />;
            })}
          </Image.PreviewGroup>
        </div>
      </div>
      {showImgList ? (
        <div className="flex-box-center img-box-footer-list">
          {(urlList.current.slice(-6) || [])?.map((item: any, index: number) => {
            return (
              <div
                className="img-box-footer-list-item"
                onClick={() => {
                  setSelectedNum(urlList.current.slice(0, -6)?.length + index);
                }}
              >
                <img src={item} alt={index + ''} key={`img-${index}`} />
              </div>
            );
          })}
        </div>
      ) : null}
      {(_.isBoolean(comparison) ? comparison : true) ? (
        <div className="contrast-box flex-box" onClick={() => setImgVisible(true)}>
          <BlockOutlined />
          对比
        </div>
      ) : null}
      {!!imgVisible ? (
        <Modal
          title={
            <div className="flex-box image-contrast-modal-title">
              模板对比
              <Button
                icon={<SwapOutlined />}
                className="image-contrast-modal-title-btn"
                onClick={() =>
                  setVisibleDirection((pre: string) => (pre === 'row' ? 'column' : 'row'))
                }
              />
            </div>
          }
          wrapClassName="image-contrast-modal"
          centered
          width="90vw"
          open={!!imgVisible}
          footer={null}
          onCancel={() => setImgVisible(false)}
          destroyOnClose
          maskClosable={false}
        >
          <div
            className="flex-box image-contrast-modal-body"
            style={{
              flexDirection: visibleDirection,
            }}
          >
            <div className={`image-contrast-modal-body-top ${visibleDirection}`}>
              <Image src={defaultImg} alt="logo" className="image-contrast-modal-body-img" />
            </div>
            <div className={`flex-box image-contrast-modal-body-bottom ${visibleDirection}`}>
              <Image
                src={urlList.current?.[selectedNum] || ''}
                alt="logo"
                className="image-contrast-modal-body-img"
              />
              <Button
                type="text"
                disabled={selectedNum === 0}
                icon={<LeftCircleOutlined className="btn-icon" />}
                className="prev-btn"
                onClick={() => onPrev()}
              />
              <Button
                type="text"
                disabled={selectedNum + 1 === urlList.current.length}
                icon={<RightCircleOutlined className="btn-icon" />}
                className="next-btn"
                onClick={() => onNext()}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default ImgCharts;
