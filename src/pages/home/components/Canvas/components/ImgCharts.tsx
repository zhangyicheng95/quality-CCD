import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Image, Modal, Skeleton } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import {
  BlockOutlined,
  DownloadOutlined,
  ExpandOutlined,
  LeftCircleOutlined,
  LockOutlined,
  RightCircleOutlined,
  SwapOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import TooltipDiv from '@/components/TooltipDiv';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ImgCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    defaultImg,
    dataValue,
    fontSize,
    showImgList,
    imgListNum,
    showFooter,
    comparison,
    magnifierSize = 6,
    markNumber,
    ifShowHeader,
    magnifierWidth,
    magnifierHeight,
    notLocalStorage,
    onImgChange = null,
    onLockImgChange = null,
    lockImg = false,
    modelRotateScreenshot = false,
    labelInxAxis = false,
    ifShowColorList = false,
  } = data;
  if (process.env.NODE_ENV === 'development' && !dataValue) {
    dataValue =
      'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0';
  }
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
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
  const [imgOriginalSize, setImgOriginalSize] = useState({ width: 1, height: 1 });
  const [imgTypeChange, setImgTypeChange] = useState('');

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
    window.addEventListener('keyup', onKeyUp, { passive: true });

    return () => {
      window?.removeEventListener?.('keyup', onKeyUp);
    };
  }, []);
  useEffect(() => {
    if (notLocalStorage) {
      // localStorage.setItem(`img-list-${params.id}-${id}`, JSON.stringify([dataValue]));
      setSelectedNum(0);
      urlList.current = !!dataValue ? [dataValue] : [];
    } else {
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
    }
  }, [dataValue, comparison]);
  useEffect(() => {
    let img: any = document.createElement('img');
    const source = urlList.current?.[selectedNum] || dataValue;
    img.src = _.isString(source) ? source : source?.url;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setImgOriginalSize({ width, height });
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
      // ul.style.width = ulWidth + 'px';
      // ul.style.height = ulHeight + 'px';
      // ul.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
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
        x -= (ratio - 1) * (e.clientX - x - marginLeft - kongbaichuX) - origin?.x;
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
  }, [selectedNum, dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);
  useEffect(() => {
    if (!dataValue) {
      const list = JSON.parse(localStorage.getItem(`img-list-${params.id}-${id}`) || '[]');
      dataValue = list?.[list?.length - 1] || '';
    }
    if (ifCanEdit) return;
    const size = magnifierSize || 4;
    const eventDom: any = dom?.current?.querySelector('.ant-image-mask');
    const ImageDom: any = dom?.current?.querySelector('.ant-image-img');
    const mask: any = dom?.current?.querySelector('.mask');
    if (!eventDom) return;

    const ul: any = imgBoxRef.current;
    //申明全局变量
    var timeStart: any = 0,
      timeEnd: any = 0,
      time: any = 0;
    //获取此刻时间
    function getTimeNow() {
      var now = new Date();
      return now.getTime();
    }
    eventDom.onmousedown = function (e: any) {
      scale = !!ul.style.transform?.split('matrix(')?.[1]?.split(',')?.[0] ? Number(ul.style.transform?.split('matrix(')?.[1]?.split(',')?.[0]) : 1;

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
            const source = urlList.current?.[selectedNum] || dataValue;
            const link = _.isString(source) ? source : source?.url || defaultImg;
            if (!imgDom) {
              bigDom = document.createElement('div');
              bigDom.className = `img-charts-big img-charts-big-${id}`;
              document.body.appendChild(bigDom);
              imgDom = document.createElement('img');
              imgDom.id = `img-charts-bigImg-${id}`;
              imgDom.src = imgTypeChange === 'NG' ?
                link.replace('NG', 'ORIG') :
                imgTypeChange === 'ORIG' ?
                  link.replace('ORIG', 'NG') :
                  link;
              bigDom.appendChild(imgDom);
            } else {
              imgDom.src = imgTypeChange === 'NG' ?
                link.replace('NG', 'ORIG') :
                imgTypeChange === 'ORIG' ?
                  link.replace('ORIG', 'NG') :
                  link;
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
        scale = ul.style.transform?.split('matrix(')?.[1]?.split(',')?.[0];
        const current1 = { x: e.clientX, y: e.clientY };
        diff.x = current1?.x - lastPointermove?.x;
        diff.y = current1.y - lastPointermove.y;
        lastPointermove = { x: current1?.x, y: current1.y };
        x += diff?.x;
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
  }, [magnifierVisible, selectedNum, dataValue]);
  const source = useMemo(() => {
    const res = notLocalStorage ? dataValue : urlList.current?.[selectedNum] || dataValue;
    return !!ifShowColorList ?
      imgTypeChange === 'NG' ?
        res.replace('NG', 'ORIG') :
        imgTypeChange === 'ORIG' ?
          res.replace('ORIG', 'NG') :
          res
      : res;
  }, [urlList.current, selectedNum, dataValue, ifShowColorList, imgTypeChange]);
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
    <div id={`echart-${id}`} className={`flex-box ${styles.imgCharts}`} style={{ fontSize }}>
      <div
        className="flex-box img-box-mark-body"
        style={showImgList ? { height: 'calc(100% - 50px)' } : { height: '100%' }}
        ref={dom}
      >
        <div
          className={`flex-box-center img-box-mark-right`}
          style={markNumber ? { width: 'calc(100% - 20px)' } : { width: '100%' }}
        >
          {
            (!!source || !!defaultImg) ? (
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
                    src={`${_.isString(source) ? source : source?.url || `${defaultImg}?__timestamp=${+new Date()}`}` + (!!labelInxAxis ? `?__timestamp=${+new Date()}` : '')}
                    alt="logo"
                    style={
                      chartSize
                        ? { width: '100%', height: 'auto' }
                        : { width: 'auto', height: '100%' }
                    }
                    preview={false}
                  />
                  {
                    (!!source?.defects && _.isArray(source?.defects)) ?
                      (source?.defects || [])?.map((defect: any, index: number) => {
                        const { defectName = '', status, position = [] } = defect;
                        const { width, height } = imgOriginalSize;
                        const add = source?.increment || { x: 0, y: 0 };
                        if (_.isNumber(status)) {
                          // 有status代表是标记OK NG
                          return <div
                            className="img-box-mark-right-defect"
                            style={{
                              left: `${(position?.[0] / (width - add.x)) * 100}%`,
                              top: `${(position?.[1] / (height - add.y)) * 100}%`,
                              color: status == 1 ? '#0f0' : '#f00',
                            }}
                            key={`defect-${index}`}
                          >
                            <div className='img-box-mark-right-defect-status' style={{ lineHeight: 0.7 }}>
                              {status == 1 ? 'OK' : 'NG'}
                            </div>
                          </div>
                        } else {
                          return <div
                            className="img-box-mark-right-defect"
                            style={{
                              left: `${(position?.[0] / (width - add.x)) * 100}%`,
                              top: `${(position?.[1] / (height - add.y)) * 100}%`,
                              width: `${((position?.[2] - position?.[0]) / (width - add.x)) * 100}%`,
                              height: `${((position?.[3] - position?.[1]) / (height - add.y)) * 100}%`,
                              border: '1px solid red',
                            }}
                            key={`defect-${index}`}
                          >
                            <div className='img-box-mark-right-defect-title' style={{ lineHeight: 0.7 }}>
                              {defectName}
                            </div>
                          </div>
                        }
                      })
                      : null
                  }
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
              </Fragment>
            ) : (
              <Skeleton.Image active={true} />
            )
          }
        </div>
        <div
          className="flex-box img-box-btn-box"
          style={Object.assign(
            {},
            !!ifShowHeader ? { display: 'flex', top: '-26px' } : {},
            modelRotateScreenshot ? { display: 'flex' } : {},
          )}
        >
          {!!onLockImgChange ? (
            <Button
              className="img-box-btn-item"
              type={'link'}
              icon={lockImg ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => {
                onLockImgChange?.();
              }}
            >
              {lockImg ? '解锁图片' : '锁定图片'}
            </Button>
          ) : null}
          {notLocalStorage ? (
            !!onImgChange ? (
              <Button
                className="img-box-btn-item"
                // className="flex-box"
                // style={{ gap: 4 }}
                type={'link'}
                icon={<SwapOutlined />}
                onClick={() => {
                  onImgChange && onImgChange?.();
                }}
              >
                切换
              </Button>
            ) : null
          ) : (
            <Fragment>
              <div
                className={`${selectedNum === 0 ? 'greyColorStyle' : ''} prev-btn`}
                onClick={() => onPrev()}
              >
                {'< '}
              </div>
              {`${selectedNum + 1}/${urlList.current?.length || 1}`}
              <div
                className={`next-btn ${selectedNum + 1 >= urlList.current.length ? 'greyColorStyle' : ''
                  }`}
                onClick={() => onNext()}
              >
                {' >'}
              </div>
            </Fragment>
          )}
          {
            ifShowColorList ?
              <Button
                className="img-box-btn-item"
                // className="flex-box"
                // style={{ gap: 4 }}
                type={'link'}
                onClick={() => {
                  setImgTypeChange((prev: any) => prev === 'NG' ? 'ORIG' : 'NG')
                }}
              >
                切换{imgTypeChange === 'NG' ? '结果图' : imgTypeChange === 'ORIG' ? '原图' : ''}
              </Button>
              : null
          }
          <DownloadOutlined
            className="img-box-btn-item"
            onClick={() => {
              // const ifCORS = (_.isString(source) ? source : source?.url || defaultImg)?.indexOf('localhost') < 0
              //   && (_.isString(source) ? source : source?.url || defaultImg)?.indexOf('127.0.0.1') < 0;
              const imgBox = dom?.current?.querySelector('.ant-image-img');  // ant-image-img
              html2canvas(imgBoxRef.current, {
                scale: 1,
                useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
                allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
              }).then((canvas: any) => {
                let imageDataURL = canvas.toDataURL('image/png', { quality: 1, });
                var link = document.createElement('a');
                link.href = imageDataURL;
                link.download = `output.png`;
                link.click();
              });
            }}
          />
          <ExpandOutlined className="img-box-btn-item" onClick={() => setVisible(true)} />
        </div>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible,
              current: urlList.current.length - 1,
              onVisibleChange: (vis) => setVisible(vis),
            }}
          >
            {(urlList.current || [])?.map?.((item: any, index: number) => {
              if (_.isString(item)) {
                item = imgTypeChange === 'NG' ?
                  item.replace('NG', 'ORIG') :
                  imgTypeChange === 'ORIG' ?
                    item.replace('ORIG', 'NG') :
                    item;
                return <Image src={item} alt={item} key={`${id}-${item}-${index}`} />;
              } else if (!!item?.url) {
                item.url = imgTypeChange === 'NG' ?
                  item?.url.replace('NG', 'ORIG') :
                  imgTypeChange === 'ORIG' ?
                    item?.url.replace('ORIG', 'NG') :
                    item?.url;
                return (
                  <Image src={item?.url} alt={item?.url} key={`${id}-${item?.url}-${index}`} />
                );
              }
              return null;
            })}
          </Image.PreviewGroup>
        </div>
      </div>
      {showImgList ? (
        <div className="flex-box-center img-box-footer-list">
          {(urlList.current.slice(!!imgListNum ? -imgListNum : -6) || [])?.map?.(
            (item: any, index: number) => {
              const type = _.isString(item)
                ? item?.indexOf('OK') > -1
                  ? 'OK'
                  : item?.indexOf('NG') > -1
                    ? !!item.split('NG/')?.[1]?.split('/')?.[0]
                      ? item.split('NG/')?.[1]?.split('/')?.[0]
                      : 'NG'
                    : ''
                : item?.type;
              const url = _.isString(item) ? item : item?.url;
              if (!!url) {
                return (
                  <div
                    key={`${id}-${type}-${index}`}
                    className="img-box-footer-list-item"
                    onClick={() => {
                      setSelectedNum(urlList.current.slice(0, -6)?.length + index);
                    }}
                  >
                    <img src={url} alt={index + ''} />
                    <div
                      className={`img-box-footer-list-item-type ${type === 'OK' ? 'OK-font' : 'NG-font'
                        }`}
                    >
                      {type}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            },
          )}
        </div>
      ) : null}
      {showFooter ? (
        <div className="flex-box-justify-between img-box-footer-list2" style={{ fontSize: 16 }}>
          {_.isObject(source) &&
            (Object.entries(source) || [])?.map?.((item: any) => {
              if (item[0] == 'url') {
                return null;
              }
              return (
                <TooltipDiv className="flex-box img-box-footer-list2-item" key={`${id}-${item[0]}`}>
                  {!!item[1]?.label ? `${item[1]?.label}：` : ''}
                  {!!item[1]?.value || _.isBoolean(item[1]?.value) ? item[1]?.value : ''}
                </TooltipDiv>
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
                src={`${urlList.current?.[selectedNum] || ''}?__timestamp=${+new Date()}`}
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
