import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import {
  Button,
  Input,
  InputNumber,
  message,
  Popover,
  Select,
  Switch,
  Tooltip,
  Upload,
} from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Lut } from 'three/examples/jsm/math/Lut.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import TWEEN from '@tweenjs/tween.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
  AimOutlined,
  BorderlessTableOutlined,
  BorderOuterOutlined,
  ClearOutlined,
  DeleteOutlined,
  EyeOutlined,
  FontSizeOutlined,
  MinusOutlined,
  PlusOutlined,
  ScissorOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import rectIcon from '@/assets/imgs/rect.svg';
import rectAllIcon from '@/assets/imgs/rect-all.svg';
import rectLeftIcon from '@/assets/imgs/rect-left.svg';
import rectRightIcon from '@/assets/imgs/rect-right.svg';
import rectTopIcon from '@/assets/imgs/rect-top.svg';
import rectBottomIcon from '@/assets/imgs/rect-bottom.svg';
import rectFrontIcon from '@/assets/imgs/rect-front.svg';
import rectBackIcon from '@/assets/imgs/rect-back.svg';
import { uuid } from '@/utils/utils';
import { btnFetch } from '@/services/api';
import FileManager from '@/components/FileManager';
import { transform } from 'lodash';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ThreeCharts: React.FC<Props> = (props: any) => {
  // models/ply/ascii/tx.ply / models/obj/walt/tx.obj / models/stl/ascii/tx.stl
  const { data = {}, id, started } = props;
  const {
    dataValue = {},
    fontSize,
    fetchType,
    xName,
    ifShowColorList = false,
    modelRotate = false,
    modelScale = false,
    modelRotateScreenshot = false,
  } = data;
  let { name, value = [], guid, addType } = dataValue;
  if (process.env.NODE_ENV === 'development') {
    // addType = 'add';
    name = 'models/output.ply'; // models/pressure.json  models/tx.stl
    value = [
      {
        type: 'left',
        name: '模具长轴最小值',
        standardValue: 651,
        measureValue: 651.01,
        offsetValue: 0.01,
        position: [
          { x: -228.03, y: -324.21, z: 172.48 },
          { x: -228.03, y: -324.21, z: 172.48 },
        ],
      },
      {
        type: 'left',
        name: '模具长轴平均值',
        standardValue: 651,
        measureValue: 652.5,
        offsetValue: 1.5,
        position: [
          { x: -226.3, y: -325.62, z: -77.52 },
          { x: -226.3, y: -325.62, z: -77.52 },
        ],
      },
      {
        type: 'left',
        name: '模具长轴最大值',
        standardValue: 651,
        measureValue: 653.93,
        offsetValue: 2.93,
        position: [
          { x: -222.99, y: -327.37, z: -377.52 },
          { x: -222.99, y: -327.37, z: -377.52 },
        ],
      },

      {
        type: 'bottom',
        name: '止口短轴宽度',
        standardValue: 735,
        measureValue: 736.15,
        offsetValue: 1.15,
        position: [
          { x: 66.16, y: -370.85, z: -418.66 },
          { x: 66.16, y: -370.85, z: -418.66 },
        ],
      },
      {
        type: 'bottom',
        name: '止口凸台宽度',
        standardValue: 735,
        measureValue: 736.82,
        offsetValue: 1.82,
        position: [
          { x: -33.84, y: -378.88, z: -419.73 },
          { x: -33.84, y: -378.88, z: -419.73 },
        ],
      },
      {
        type: 'bottom',
        name: '止口长轴宽度',
        standardValue: 735,
        measureValue: 737.65,
        offsetValue: 2.65,
        position: [
          { x: -233.84, y: -307.3, z: -422.31 },
          { x: -233.84, y: -307.3, z: -422.31 },
        ],
      },

      {
        type: 'top',
        name: '模具高度最小值',
        standardValue: 735,
        measureValue: 736.15,
        offsetValue: 1.15,
        position: [
          { x: 66.16, y: -370.85, z: -418.66 },
          { x: 66.16, y: -370.85, z: -418.66 },
        ],
      },
      {
        type: 'top',
        name: '模具高度平均值',
        standardValue: 735,
        measureValue: 736.82,
        offsetValue: 1.82,
        position: [
          { x: -33.84, y: -378.88, z: -419.73 },
          { x: -33.84, y: -378.88, z: -419.73 },
        ],
      },
      {
        type: 'top',
        name: '模具高度最大值',
        standardValue: 735,
        measureValue: 737.65,
        offsetValue: 2.65,
        position: [
          { x: -233.84, y: -307.3, z: -422.31 },
          { x: -233.84, y: -307.3, z: -422.31 },
        ],
      },

      {
        type: 'right',
        name: '模具短轴最小值',
        standardValue: 461,
        measureValue: 458.98,
        offsetValue: -2.02,
        position: [
          { x: -222.99, y: -327.37, z: -377.52 },
          { x: -222.99, y: -327.37, z: -377.52 },
        ],
      },
      {
        type: 'right',
        name: '模具短轴平均值',
        standardValue: 461,
        measureValue: 460.13,
        offsetValue: -0.87,
        position: [
          { x: -226.3, y: -325.62, z: -77.52 },
          { x: -226.3, y: -325.62, z: -77.52 },
        ],
      },
      {
        type: 'right',
        name: '模具短轴最大值1',
        standardValue: 461,
        measureValue: 460.85,
        offsetValue: -0.15,
        position: [
          { x: -227.73, y: -324.38, z: 122.48 },
          { x: -227.73, y: -324.38, z: 122.48 },
        ],
      },
      {
        type: 'right',
        name: '模具短轴最大值2',
        standardValue: 461,
        measureValue: 460.85,
        offsetValue: -0.15,
        position: [
          { x: -227.73, y: -324.38, z: 122.48 },
          { x: -227.73, y: -324.38, z: 122.48 },
        ],
      },
      {
        type: 'right',
        name: '模具短轴最大值3',
        standardValue: 461,
        measureValue: 460.85,
        offsetValue: -0.15,
        position: [
          { x: -227.73, y: -324.38, z: 122.48 },
          { x: -227.73, y: -324.38, z: 122.48 },
        ],
      },
      {
        type: 'right',
        name: '模具短轴最大值4',
        standardValue: 461,
        measureValue: 460.85,
        offsetValue: -0.15,
        position: [
          { x: -227.73, y: -324.38, z: 122.48 },
          { x: -227.73, y: -324.38, z: 122.48 },
        ],
      },
    ];
    // let arr = [];
    // for (let i = 1; i < 48; i++) {
    //     arr.push(i);
    // }
    // arr.forEach?.((i: any, index: number) => {
    //     setTimeout(() => {
    //         if (!!scene.current) {
    //             loadModel(`models/lines_${i}.ply`, addType);
    //         }
    //     }, 1000 + index * 300);
    // })
  }
  // 进来给默认展示比例
  // if (!localStorage.getItem('cameraScale')) {
  //     localStorage.setItem('cameraScale', '2.7');
  // }

  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const dom = useRef<any>();
  const cameraRef = useRef<any>();
  const [selectedBtn, setSelectedBtn] = useState(['']);
  const [cameraSwitchTime, setCameraSwitchTime] = useState(2);
  const [cameraSwitch, setCameraSwitch] = useState(false);
  const [meshHasColor, setMeshHasColor] = useState(false);
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>('');

  const theme = useMemo(() => {
    return params?.contentData?.theme || 'realDark';
  }, [params?.contentData?.theme]);
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);
  useEffect(() => {
    if (!_.isString(name)) {
      message.error('3D组件数据格式不正确，请检查');
      console.log('ThreeCharts', dataValue);
      return;
    }
  }, [name]);

  let renderer = useRef<any>();
  const labelRenderer = new CSS2DRenderer();
  let scene = useRef<any>(),
    uiScene = useRef<any>(),
    orthoCamera = useRef<any>(),
    camera = useRef<any>(),
    controls = useRef<any>(),
    stats = useRef<any>(),
    animateId: number = 0,
    lut: any = new Lut(),
    sprite: any = null;

  // 定义常变量
  let ctrlDown = false;
  let lineId = 'measure_0';
  let line: any;
  let drawingLine = false;
  const raycaster = new THREE.Raycaster();
  let intersects;
  const mouse = new THREE.Vector2();
  let measurementLabels: any = {},
    measurements: any = [];
  // loader后能被标注的点云
  const pickableObjects = new Array();

  if (!localStorage.getItem('scale')) {
    localStorage.setItem('scale', JSON.stringify({ value: '1', unit: 'm' }));
  }
  const clearCanvas = () => {
    console.log('清理缓存');
    cancelAnimationFrame(animateId);
    stats?.current?.dom && dom?.current?.removeChild(stats?.current?.dom);
    scene?.current?.traverse((child: any) => {
      if (child?.material) {
        child?.material?.dispose?.();
      }
      if (child?.geometry) {
        child?.geometry?.dispose?.();
      }
      child = null;
    });
    (Object.values(measurementLabels) || [])?.forEach?.((label: any) => {
      scene?.current?.remove?.(label);
    });
    // 场景中的参数释放清理或者置空等
    if (!!dom.current && dom.current.innerHTML) {
      dom.current.innerHTML = `
                <div class="three-mask flex-box">
                    <progress class="process" value="0" ></progress>
                    <span class="process-text">0%</span>
                </div>
                <canvas id="demoBox" />
            `;
    }
    if (!!renderer?.current?.domElement) {
      renderer.current.domElement.innerHTML = '';
      renderer.current.domElement = undefined;
    }
    // renderer.current.forceContextLoss();
    renderer?.current?.dispose?.();
    renderer.current = undefined;
    // dom.current.removeChild(renderer.current.domElement);
    // dom.current.removeChild(labelRenderer.domElement);
    scene.current?.clear();
    scene.current = undefined;
    stats.current = undefined;
    camera.current = undefined;
    controls.current = undefined;
    setSelectedBtn([]);
  };
  // 初始化场景数据，渲染点云
  useEffect(() => {
    if (ifCanEdit) {
      return;
    }
    if (!name && !selectedPath) {
      if (!!dom.current && dom.current.innerHTML) {
        const maskBox: any = document?.querySelector('.three-mask');
        const processBox = maskBox?.querySelector('.process');
        const processText = maskBox?.querySelector('.process-text');
        if (!!processBox && !!processText) {
          maskBox.style.display = 'flex';
          processBox.style.display = 'none';
          processText.style.display = 'block';
          processText.style.textAlign = 'center';
          processText.style.fontSize = `${fontSize + 20}px`;
          processText.innerText = !!started ? `正在扫描，请稍候` : `点云数据路径为空`;
        }
      }
      return;
    }
    console.log('three160行: 点云路径', selectedPath || name);
    // addType为add时，代表增量渲染，不清除其他数据
    if (!!scene.current && addType === 'add') {
      loadModel(name, value, addType);
      return;
    } else {
    }
    // 外层盒子
    const box: any = dom?.current;
    // 渲染场景盒子
    const canvas: any = document.querySelector('#demoBox');
    // 按钮-标注
    const bzBtn01: any = document.querySelector('#bzBtn01');
    // 按钮-框选
    const bzBtn02: any = document.querySelector('#bzBtn02');
    // 按钮-坐标轴
    const bzBtn03: any = document.querySelector('#bzBtn03');
    // 按钮-透视
    const bzBtn04: any = document.querySelector('#bzBtn04');
    // 按钮-清理数据
    const bzBtn05: any = document.querySelector('#bzBtn05');
    // 按钮-缩小模型
    const bzBtn06: any = document.querySelector('#bzBtn06');
    // 按钮-放大模型
    const bzBtn07: any = document.querySelector('#bzBtn07');
    // 按钮-截图
    const bzBtn08: any = document.querySelector('#bzBtn08');
    // 初始化dom
    renderer.current = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // 防止后渲染的scene覆盖前面的scene
    renderer.current.autoClear = false; // 缓冲区数据清理，默认为true
    renderer.current.shadowMap.enabled = true;
    renderer.current.setSize(box.offsetWidth, box.offsetHeight);
    box.appendChild(renderer.current.domElement);
    labelRenderer.setSize(box.offsetWidth, box.offsetHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style['font-size'] = 'inherit';
    box.appendChild(labelRenderer.domElement);
    // @ts-ignore 左上角，内存占用显示
    stats.current = new Stats();
    stats.current.dom.style.position = 'absolute';
    // stats.dom.style.top = "28px";
    box.appendChild(stats.current.dom);
    // 场景
    scene.current = new THREE.Scene();
    uiScene.current = new THREE.Scene();
    const background = theme === 'realDark' ? new THREE.Color(0x2b313b) : new THREE.Color(0xeeeeee);
    // scene.current.background = background;
    // 坐标轴（右手定则，大拇指是x）
    const axesHelper = new THREE.AxesHelper(1000);
    axesHelper.name = 'axis';
    axesHelper.visible = false;
    scene.current.add(axesHelper);
    // 光源
    {
      let light = null,
        light2 = null,
        light3 = null;
      //平行光
      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 2000, 2000).normalize();
      scene.current.add(light);
      //环境光
      light2 = new THREE.HemisphereLight(0xffffff);
      scene.current.add(light2);
      //点光源
      light3 = new THREE.PointLight(0xffffff);
      // light3.position.set(0, 0, 0);
      scene.current.add(light3);
    }
    // 相机
    camera.current = new THREE.PerspectiveCamera(
      75, // fov — 摄像机视锥体垂直视野角度
      canvas.offsetWidth / canvas.offsetHeight, // aspect — 摄像机视锥体长宽比
      0.1, // near — 摄像机视锥体近端面
      1000000, // far — 摄像机视锥体远端面
    );
    camera.current.position.set(1000, -1400, 0);
    scene.current.add(camera.current);
    orthoCamera.current = new THREE.OrthographicCamera(
      -1, // left — 摄像机视锥体左侧面。
      1, // right — 摄像机视锥体右侧面。
      1, // top — 摄像机视锥体上侧面。
      -1, // bottom — 摄像机视锥体下侧面。
      0.1, // near — 摄像机视锥体近端面
      1000000, // far — 摄像机视锥体远端面
    );
    orthoCamera.current.position.set(0.5, 0, 1);
    // 控制器 (旋转/缩放)
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.enableDamping = true;
    controls.current.enableZoom = modelScale;
    // 开始渲染,加载url
    loadModel(selectedPath || name, value);
    // 取消标注的公共方法
    function cancelMeasurement() {
      ctrlDown = false;
      controls.current.enabled = true;
      renderer.current.domElement.style.cursor = 'pointer';
      setSelectedBtn((prev: any) => prev.filter((i: any) => i !== 'bzBtn01'));
      if (drawingLine) {
        //delete the last line because it wasn't committed
        scene.current.remove(line);
        scene.current.remove(measurementLabels[lineId]);
        drawingLine = false;
      }
    }
    // 标注
    function bzBtnFun01() {
      if (!ctrlDown) {
        ctrlDown = true;
        controls.current.enabled = false;
        renderer.current.domElement.style.cursor = 'crosshair';
        setSelectedBtn((prev: any) => (prev || []).concat('bzBtn01'));
      } else {
        cancelMeasurement();
      }
    }
    bzBtn01?.addEventListener('click', bzBtnFun01);
    // 边框
    function bzBtnFun02() {
      const models = getAllModelsFromScene(scene.current);
      setSelectedBtn((prev: any) => {
        if ((prev || []).includes('bzBtn02')) {
          models.forEach?.((mesh: any) => {
            (mesh.children || []).filter((i: any) => i?.type === 'BoxHelper')[0].visible = false;
          });
          return prev.filter((i: any) => i !== 'bzBtn02');
        } else {
          models.forEach?.((mesh: any) => {
            (mesh.children || []).filter((i: any) => i?.type === 'BoxHelper')[0].visible = true;
          });
          return (prev || []).concat('bzBtn02');
        }
      });
    }
    bzBtn02?.addEventListener('click', bzBtnFun02);
    // 坐标轴
    function bzBtnFun03() {
      const axis: any = scene?.current?.getObjectByName?.('axis');
      setSelectedBtn((prev: any) => {
        if ((prev || []).includes('bzBtn03')) {
          axis.visible = false;
          return prev.filter((i: any) => i !== 'bzBtn03');
        } else {
          axis.visible = true;
          return (prev || []).concat('bzBtn03');
        }
      });
    }
    bzBtn03?.addEventListener('click', bzBtnFun03);
    // 透视
    function bzBtnFun04() {
      const models = getAllModelsFromScene(scene.current);
      /**
       * 1：开启透视，隐藏卡片
       * 0：关闭透视，显示卡片
       */
      function toggleLabelOpacity(type: number) {
        Object.entries(measurementLabels).forEach?.((label: any) => {
          if (!!label[1]?.element?.firstElementChild) {
            label[1].element.firstElementChild.style.display = type === 1 ? 'none' : 'block';
          }
          if (!!label[1]?.element?.lastElementChild) {
            label[1].element.lastElementChild.style.display = type === 1 ? 'block' : 'none';
          }
        });
      }
      models.forEach?.((mesh: any) => {
        if (!!mesh.material) {
          // 有材质
          const depth = mesh.material?.depthTest;
          if (depth) {
            // 开启透视
            mesh.material.depthTest = false;
            setSelectedBtn((prev: any) => (prev || []).concat('bzBtn04'));
            toggleLabelOpacity(1);
          } else {
            // 关闭透视
            mesh.material.depthTest = true;
            setSelectedBtn((prev: any) => prev.filter((i: any) => i !== 'bzBtn04'));
            toggleLabelOpacity(0);
          }
        } else if (mesh.children.filter((i: any) => i?.type === 'Points')[0]) {
          // 没有材质，点组成
          const depth = mesh.children.filter((i: any) => i?.type === 'Points')[0]?.material
            ?.depthTest;
          if (!!mesh.children.filter((i: any) => i?.type === 'Points')[0]?.material) {
            if (depth) {
              // 开启透视
              mesh.children.filter((i: any) => i?.type === 'Points')[0].material.depthTest = false;
              setSelectedBtn((prev: any) => (prev || []).concat('bzBtn04'));
              toggleLabelOpacity(1);
            } else {
              // 关闭透视
              mesh.children.filter((i: any) => i?.type === 'Points')[0].material.depthTest = true;
              setSelectedBtn((prev: any) => prev.filter((i: any) => i !== 'bzBtn04'));
              toggleLabelOpacity(0);
            }
          }
        }
      });
    }
    bzBtn04?.addEventListener('click', bzBtnFun04);
    // 清理数据
    function bzBtnFun05() {
      (measurements || []).forEach?.((line: any) => {
        scene.current.remove(line);
        scene.current.remove(measurementLabels[line.name]);
        measurementLabels[line.name] = null;
      });
      lineId = 'measure_0';
      measurements = [];
      measurementLabels = {};
    }
    bzBtn05?.addEventListener('click', bzBtnFun05);
    // 缩放
    function bzBtnFun06(type: number) {
      const currentPosition = camera.current.position;
      const currentZoom = !!localStorage.getItem('cameraScale')
        ? Number(localStorage.getItem('cameraScale'))
        : camera.current.zoom || 1.5;
      const targetZoom =
        currentZoom + type > 0.1 ? (currentZoom + type < 10 ? currentZoom + type : 10) : 0.1;

      camera.current.zoom = targetZoom;
      // localStorage.setItem('cameraScale', targetZoom + '');
      const targetPosition = new THREE.Vector3(
        (currentPosition?.x / currentZoom) * targetZoom,
        (currentPosition?.y / currentZoom) * targetZoom,
        (currentPosition?.z / currentZoom) * targetZoom,
      );
      console.log('相机倍数：', targetZoom);

      var tween = new TWEEN.Tween(currentPosition)
        .to(targetPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
          camera?.current?.position?.copy?.(currentPosition);
          camera?.current?.lookAt?.(0, 0, 0);
        });
      tween.start();
    }
    bzBtn06?.addEventListener('click', () => bzBtnFun06(0.1));
    bzBtn07?.addEventListener('click', () => bzBtnFun06(-0.1));
    // 截图
    function bzBtnFun08() {
      captureScreenshot('download');
    }
    bzBtn08?.addEventListener('click', () => bzBtnFun08());
    // 取消标注
    function onKeyUp(event: any) {
      if (event.key === 'Escape') {
        cancelMeasurement();
      }
    }
    window.addEventListener('keyup', onKeyUp);
    function onMouseDown(event: any) {
      setCameraSwitch(false);
      if (ctrlDown) {
        raycaster.setFromCamera(mouse, camera.current);
        intersects = raycaster.intersectObjects(pickableObjects, false);
        if (intersects.length > 0) {
          if (!drawingLine) {
            // 起点
            const points = [];
            points.push(intersects[0].point);
            points.push(intersects[0].point.clone());
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            line = new THREE.LineSegments(
              geometry,
              new THREE.LineBasicMaterial({
                color: 0xff0000, // 射线颜色
                transparent: true,
                opacity: 0.75,
                // depthTest: false,
                // depthWrite: false,
              }),
            );
            line.name = `measure_${measurements.length}`;
            line.frustumCulled = false;
            scene.current.add(line);
            measurements = measurements.concat(line);
            const measurementDiv = document.createElement('div');
            measurementDiv.className = 'label';
            measurementDiv.innerHTML = `
                        <div>
                            开始
                        </div>
                        <div style="display: none;">开始</div>
                        `;
            const measurementLabel: any = new CSS2DObject(measurementDiv);
            measurementLabel.position.copy(intersects[0].point);
            measurementLabels[lineId] = measurementLabel;
            scene.current.add(measurementLabels[lineId]);
            drawingLine = true;
          } else {
            // 终点
            const positions = line.geometry.attributes.position.array;
            positions[3] = intersects[0].point.x;
            positions[4] = intersects[0].point.y;
            positions[5] = intersects[0].point.z;
            line.geometry.attributes.position.needsUpdate = true;
            lineId = `measure_${measurements.length}`;
            drawingLine = false;

            console.log(positions);
            const cameraPosition = camera?.current?.position || {};
            const cameraMax = Math.max(
              Math.abs(cameraPosition.x),
              Math.abs(cameraPosition.y),
              Math.abs(cameraPosition.z),
            );
            let cameraDirection = '';
            if (cameraMax === Math.abs(cameraPosition.x)) {
              cameraDirection = 'y';
            } else if (cameraMax === Math.abs(cameraPosition.y)) {
              cameraDirection = 'z';
            } else if (cameraMax === Math.abs(cameraPosition.z)) {
              cameraDirection = 'y';
            }
            const geometry = new THREE.BoxGeometry(
              Math.abs(positions[3] - positions[0]),
              Math.abs(positions[4] - positions[1]),
              Math.abs(positions[5] - positions[2]),
            );
            const material = new THREE.MeshBasicMaterial({ opacity: 0 });
            material.opacity = 0;
            material.transparent = true;
            const cube = new THREE.Mesh(geometry, material);
            var boxHelper = new THREE.BoxHelper(cube, 0xff0000);
            boxHelper.name = 'measureBoxHelper';
            boxHelper.visible = true;
            cube.attach(boxHelper);
            scene.current.add(cube);
          }
        }
      } else {
        event.preventDefault();
        mouse.x = (event.offsetX / renderer.current?.domElement.offsetWidth) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.current?.domElement.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera.current);
        intersects = raycaster.intersectObjects(pickableObjects, false);

        // 显示边框
        const models = getAllModelsFromScene(scene.current);
        const axis: any = scene?.current?.getObjectByName?.('axis');
        models.forEach?.((mesh: any) => {
          (mesh.children || [])
            .filter((i: any) => i?.type === 'BoxHelper')
            .forEach?.((child: any) => {
              child.visible = true;
            });
        });
        // 显示坐标轴
        axis.visible = true;
      }
    }
    function onDocumentMouseMove(event: any) {
      event.preventDefault();
      mouse.x = (event.offsetX / renderer.current.domElement.offsetWidth) * 2 - 1;
      mouse.y = -(event.offsetY / renderer.current.domElement.offsetHeight) * 2 + 1;
      if (drawingLine) {
        raycaster.setFromCamera(mouse, camera.current);
        intersects = raycaster.intersectObjects(pickableObjects, false);
        if (intersects.length > 0) {
          const positions = line.geometry.attributes.position.array;
          const v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
          const v1 = new THREE.Vector3(
            intersects[0].point.x,
            intersects[0].point.y,
            intersects[0].point.z,
          );
          positions[3] = intersects[0].point.x;
          positions[4] = intersects[0].point.y;
          positions[5] = intersects[0].point.z;
          line.geometry.attributes.position.needsUpdate = true;
          const distance = v0.distanceTo(v1);
          let scale = { value: 1, unit: 'm' };
          try {
            scale = JSON.parse(
              localStorage.getItem('scale') || JSON.stringify({ value: 1, unit: 'm' }),
            );
          } catch (err) {
            console.log('localStorge中的scale格式不对', err);
            localStorage.removeItem('scale');
          }
          const value = (distance * Number(scale?.value || '1')).toFixed(2) + (scale?.unit || 'm');
          measurementLabels[lineId].element.innerHTML = `
                    <div>
                        ${value}
                    </div>
                    <div style="display: none;">${value}</div>
                    `;
          measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
        }
      }
    }
    function onMouseUp() {
      if (!renderer.current) return;
      const models = getAllModelsFromScene(scene.current);
      const axis: any = scene?.current?.getObjectByName?.('axis');
      setSelectedBtn((prev: any) => {
        if (!(prev || []).includes('bzBtn02')) {
          // 隐藏边框
          models.forEach?.((mesh: any) => {
            const item = (mesh.children || []).filter(
              (i: any) => i.name !== 'measureBoxHelper' && i?.type === 'BoxHelper',
            );
            if (item?.[0]) {
              item[0].visible = false;
            }
          });
        }
        if (!(prev || []).includes('bzBtn03')) {
          // 隐藏坐标轴
          axis.visible = false;
        }
        return prev;
      });
    }
    renderer.current.domElement.addEventListener('pointerdown', onMouseDown, false);
    renderer.current.domElement.addEventListener('pointerup', onMouseUp, false);
    renderer.current.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    function animate() {
      animateId = requestAnimationFrame(animate);
      controls && controls.current.update();
      render();
      TWEEN.update();
      !!stats.current && stats.current.update();
    }
    function render() {
      labelRenderer.render(scene.current, camera.current);
      renderer.current.render(scene.current, camera.current);
      renderer.current.clearDepth(); // 清除深度缓冲区
      renderer.current.render(uiScene.current, orthoCamera.current);
    }
    animate();

    return () => {
      bzBtn01?.removeEventListener?.('click', bzBtnFun01);
      bzBtn02?.removeEventListener?.('click', bzBtnFun02);
      bzBtn03?.removeEventListener?.('click', bzBtnFun03);
      bzBtn04?.removeEventListener?.('click', bzBtnFun04);
      bzBtn05?.removeEventListener?.('click', bzBtnFun05);
      bzBtn06?.removeEventListener?.('click', bzBtnFun06);
      bzBtn07?.removeEventListener?.('click', bzBtnFun06);
      bzBtn08?.removeEventListener?.('click', bzBtnFun08);
      renderer?.current?.domElement?.removeEventListener?.('pointerdown', onMouseDown, false);
      renderer?.current?.domElement?.removeEventListener?.('pointerup', onMouseUp, false);
      renderer?.current?.domElement?.removeEventListener?.('mousemove', onDocumentMouseMove, false);
      window?.removeEventListener?.('keyup', onKeyUp);
      setCameraSwitch && setCameraSwitch?.(false);
      if (cameraRef?.current) {
        clearTimeout(cameraRef?.current);
      }
      if (addType !== 'add') {
        clearCanvas();
      }
    };
  }, [theme, name, guid, started, selectedPath]);
  // 获取场景中的全部模型对象
  function getAllModelsFromScene(scene: any) {
    const models: any = [];

    scene.traverse((object: any) => {
      if (object.isMesh || object.isPoints) {
        models.push(object);
      }
    });

    return models;
  }
  // 初始化场景之后，渲染点云
  const loadModel = (name: string, value: any, addType?: string) => {
    // 蒙层
    const maskBox: any = document?.querySelector('.three-mask');
    const startTime = +new Date();
    const timeHost = () => {
      const endTime = +new Date();
      console.log('模型加载渲染耗时:', `${(endTime - startTime) / 1000}s`);
    };
    function addPickable(mesh: any) {
      timeHost();
      const models = getAllModelsFromScene(scene.current);
      mesh.name = `tx-${models.length}`;
      if (mesh?.material) {
        mesh.material.side = THREE.DoubleSide;
      } else if (mesh.children?.[0] && !!mesh.children[0]?.material) {
        mesh.children[0].material.side = THREE.DoubleSide;
      }
      // 边框
      const border = new THREE.BoxHelper(mesh, 0x00ffff); //object 模型
      border.name = 'border';
      border.visible = false;
      mesh.attach(border);

      // 居中显示
      let box = new THREE.Box3().setFromObject(mesh); // 获取模型的包围盒
      let mdlen = box.max.x - box.min.x; // 模型长度
      let mdhei = box.max.y - box.min.y; // 模型高度
      let mdwid = box.max.z - box.min.z; // 模型宽度
      let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
      let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
      let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
      const max = Math.max(mdlen, mdhei, mdwid);
      let scale = (1.3 * mdwid) / dom.current.clientHeight;
      if (scale >= 2) {
        scale = mdwid / (dom.current.clientHeight - 50);
      } else if (scale <= 1.5) {
        scale = 1.5;
      }
      if (!!localStorage.getItem('cameraScale')) {
        scale = Number(localStorage.getItem('cameraScale'));
      }
      console.log('scale:', scale);
      const basicPosition = new THREE.Vector3(0, -scale * max, 0);
      if (addType === 'add') {
        models?.forEach?.((model: any) => {
          model.material = new THREE.PointsMaterial({
            // MeshStandardMaterial,MeshBasicMaterial,PointsMaterial
            color: '#808080',
          });
        });
        // if (mesh?.material) {
        //     mesh.material.color = '#ffd700';
        // } else if (mesh.children?.[0] && !!mesh.children[0]?.material) {
        //     mesh.children[0].material.color = '#ffd700';
        // }

        let targetPos = camera.current.position;
        if (max === box.max.x) {
          targetPos = new THREE.Vector3(scale * max, 0, 0);
        } else if (max === box.max.z) {
          targetPos = new THREE.Vector3(0, 0, scale * max);
        } else if (max === box.max.y) {
          targetPos = new THREE.Vector3(0, scale * max, 0);
        }
        var currentPos = camera.current.position;
        var tween = new TWEEN.Tween(currentPos)
          .to(targetPos, 1000) // 目标位置，动画时间
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function () {
            camera.current.position.copy(currentPos);
            camera.current.lookAt(box.max.x, box.max.y, box.max.z);
          });
        tween.start();
      } else {
        mesh.position.set(-x1, -y1, -z1); // 将模型进行偏移
        // if (max === box.max.x) {
        //     camera.current.position.set(0, mdhei / 2, scale * max);
        // } else if (max === box.max.y) {
        //     camera.current.position.set(0, 0, scale * max);
        // } else {

        animateCamera(basicPosition);
        // }
        camera.current.zoom = scale;
        // localStorage.setItem('cameraScale', JSON.stringify(scale));
        effectMeasureLine(mesh, value);
      }
      // 把点云放到可控数组里，用于画线标注
      mesh.frustumCulled = false;
      mesh.traverse(function (child: any) {
        // if (child.isMesh) {
        child.frustumCulled = false;
        let m = child;
        switch (m.name) {
          case 'Plane':
            m.receiveShadow = true;
            break;
          default:
            m.castShadow = true;
        }
        pickableObjects.push(m);
        // }
      });
      maskBox.style.display = 'none';

      scene.current.add(mesh);
      // 开启相机巡航
      setCameraSwitch(modelRotate);
      if (modelRotateScreenshot) {
        // 开启循环自动截图
        if (!maskBox) return;
        const processBox = maskBox?.querySelector('.process');
        const processText = maskBox?.querySelector('.process-text');
        maskBox.style.display = 'flex';
        maskBox.style.zIndex = 99;
        processBox.style.display = 'none';
        processText.style.display = 'block';
        processText.style.textAlign = 'center';
        processText.style.fontSize = `${fontSize + 20}px`;
        processText.innerText = `自动截图上传中`;

        var cameraList = [
          new THREE.Vector3(max * -scale, 0, 0),
          new THREE.Vector3(0, 0, max * scale),

          new THREE.Vector3(0, max * scale, 0),
          new THREE.Vector3(0, 0, max * scale),
          new THREE.Vector3(0, max * -scale, 0),

          new THREE.Vector3(max * scale, 0, 0),
          new THREE.Vector3(0, 0, max * -scale),
        ];
        loopScreenshot(cameraList, 0, basicPosition, maskBox);
      }
    }
    function processFun(xhr: any) {
      if (addType === 'add') return;
      const { loaded = 0, total = 1 } = xhr;
      if (!maskBox) return;
      const processBox = maskBox?.querySelector('.process');
      const processText = maskBox?.querySelector('.process-text');
      maskBox.style.display = 'flex';
      processBox.style.display = 'block';
      processText.style.display = 'block';
      if (!!loaded && !!total) {
        const process = `${((loaded / total) * 100 + '')?.slice?.(0, 5)}%`;
        processBox.value = loaded / total;
        processText.innerText = process;
      } else {
        processBox.value = 0.99;
        processText.innerText = '99%';
      }
    }
    function processError(error: any) {
      if (!maskBox) return;
      const processBox = maskBox?.querySelector('.process');
      const processText = maskBox?.querySelector('.process-text');
      processBox.style.display = 'none';
      processText.style.display = 'block';
      processText.style.textAlign = 'center';
      processText.innerText = `点云数据有问题或路径不正确，请检查
        
        ${name}`;
      message.error('点云数据有问题或路径不正确，请检查', 5);
      console.log('点云数据有问题:', error);
    }
    // 加载卡片数据
    function effectMeasureLine(mesh: any, value: any) {
      // const models = getAllModelsFromScene(scene.current);
      if (!!scene.current && !!value?.length && !!mesh) {
        let counter: any = {
          top: [],
          right: [],
          bottom: [],
          left: [],
        };
        let indexCount = 0;
        (value || []).forEach?.((item: any, index: number) => {
          let { type } = item;
          if (type === 'left') {
            counter.left.push(item);
          } else if (type === 'right') {
            counter.right.push(item);
          } else if (type === 'top') {
            counter.top.push(item);
          } else if (type === 'bottom') {
            counter.bottom.push(item);
          }
        });
        Object.entries(counter)?.forEach?.((count: any) => {
          (count[1] || []).forEach?.((item: any, index: number) => {
            let { type, name, standardValue, measureValue, offsetValue, position = [] } = item;
            const box = new THREE.Box3().setFromObject(mesh); // 获取模型的包围盒
            const length = box.max.x - box.min.x; // 模型长度
            const width = box.max.z - box.min.z; // 模型宽度
            const height = box.max.y - box.min.y; // 模型高度
            const labelDashLength = 3 / 4;
            let localPosition: any = [];
            if (type === 'left') {
              const point = {
                x: -1 * length * labelDashLength,
                y: 0,
                z:
                  index === 0 || index + 1 === count[1].length
                    ? (width / 2) * (index + 1 > count[1].length / 2 ? -1 : 1)
                    : index * 2 + 1 === count[1].length
                      ? 0
                      : (width / 2 / (parseFloat(count[1].length / 2) + 1)) *
                      (index + 1 > count[1].length / 2
                        ? Math.abs(count[1].length / 2 - index - 1) < count[1].length / 2
                          ? count[1].length / 2 - index - 1
                          : (count[1].length / 2) * -1
                        : count[1].length / 2 - index),
              };
              position = [point, point];
              localPosition = [
                {
                  ...point,
                  x: (-1 * length) / 3,
                },
                {
                  ...point,
                  x: (-1 * length) / 3,
                },
              ];
              counter.left += 1;
            } else if (type === 'right') {
              const point = {
                x: length * labelDashLength,
                y: 0,
                z:
                  index === 0 || index + 1 === count[1].length
                    ? (width / 2) * (index + 1 > count[1].length / 2 ? -1 : 1)
                    : index * 2 + 1 === count[1].length
                      ? 0
                      : (width / 2 / (parseFloat(count[1].length / 2) + 1)) *
                      (index + 1 > count[1].length / 2
                        ? Math.abs(count[1].length / 2 - index - 1) < count[1].length / 2
                          ? count[1].length / 2 - index - 1
                          : (count[1].length / 2) * -1
                        : count[1].length / 2 - index),
              };
              position = [point, point];
              localPosition = [
                {
                  ...point,
                  x: length / 3,
                },
                {
                  ...point,
                  x: length / 3,
                },
              ];
              counter.right += 1;
            } else if (type === 'top') {
              const point = {
                x:
                  index === 0 || index + 1 === count[1].length
                    ? (length / 2) * (index + 1 > count[1].length / 2 ? -1 : 1)
                    : index * 2 + 1 === count[1].length
                      ? 0
                      : (length / 2 / (parseFloat(count[1].length / 2) + 1)) *
                      (index + 1 > count[1].length / 2
                        ? Math.abs(count[1].length / 2 - index - 1) < count[1].length / 2
                          ? count[1].length / 2 - index - 1
                          : (count[1].length / 2) * -1
                        : count[1].length / 2 - index),
                y: 0,
                z: (width * 5) / 6,
              };
              position = [point, point];
              localPosition = [
                {
                  ...point,
                  z: (1 / 2) * width,
                },
                {
                  ...point,
                  z: (1 / 2) * width,
                },
              ];
              counter.top += 1;
            } else if (type === 'bottom') {
              const point = {
                x:
                  index === 0 || index + 1 === count[1].length
                    ? (length / 2) * (index + 1 > count[1].length / 2 ? -1 : 1)
                    : index * 2 + 1 === count[1].length
                      ? 0
                      : (length / 2 / (parseFloat(count[1].length / 2) + 1)) *
                      (index + 1 > count[1].length / 2
                        ? Math.abs(count[1].length / 2 - index - 1) < count[1].length / 2
                          ? count[1].length / 2 - index - 1
                          : (count[1].length / 2) * -1
                        : count[1].length / 2 - index),
                y: 0,
                z: -1 * width,
              };
              position = [point, point];
              localPosition = [
                {
                  ...point,
                  z: (-1 * width) / 2,
                },
                {
                  ...point,
                  z: (-1 * width) / 2,
                },
              ];
              counter.bottom += 1;
            }
            const geometry = new THREE.BufferGeometry().setFromPoints([
              localPosition[0],
              position[0],
            ]);
            line = new THREE.LineSegments(
              geometry,
              new THREE.LineDashedMaterial({
                color: 0xff0000, // 射线颜色
                linewidth: 1,
                scale: 1,
                dashSize: 10,
                gapSize: 10,
                // depthTest: false,
                // depthWrite: false,
              }),
            );
            line.computeLineDistances(); // 虚线
            line.name = `measure_${indexCount}`;
            line.visible = true;
            line.frustumCulled = false;
            scene.current.add(line);
            measurements = measurements.concat(line);
            // 渲染信息卡片
            const measurementDiv = document.createElement('div');
            measurementDiv.className = 'label';
            measurementDiv.innerHTML = `
                        <div>
                            <div class="item">${name}</div>
                            <div class="item" style="text-align:center;">${standardValue} ± ${offsetValue}</div>
                            <div class="flex-box item"><div class="key">标准值</div><div class="value">${standardValue}</div></div>
                            <div class="flex-box item"><div class="key">实测值</div><div class="value">${measureValue}</div></div>
                            <div class="flex-box item"><div class="key">偏差值</div><div class="value">${offsetValue}</div></div>
                        </div>
                        <div style="display: none;">${measureValue}</div>
                    `;
            const measurementLabel: any = new CSS2DObject(measurementDiv);
            measurementLabel.position.copy({
              x: (position[0].x + position[1].x) / 2,
              y: (position[0].y + position[1].y) / 2,
              z: (position[0].z + position[1].z) / 2,
            });
            measurementLabels[line.name] = measurementLabel;
            scene.current.add(measurementLabels[line.name]);
            lineId = line.name;
            indexCount += 1;
            // const closeDom = measurementDiv.querySelector('.close');
            // closeDom?.addEventListener('dbclick', () => {
            //     scene.current.remove(measurementLabel);
            //     scene.current.remove(line);
            // });
          });
        });
      }
    }

    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());
    if (name?.indexOf('.glb') > -1) {
      new GLTFLoader().load(
        name,
        function (gltf) {
          addPickable(gltf.scene);
        },
        (xhr) => processFun(xhr),
        (error) => processError(error),
      );
    } else if (name?.indexOf('.ply') > -1) {
      new PLYLoader().load(
        name,
        function (geometry: any) {
          // 用于计算模型的顶点法向量，以使模型的光照效果更为真实。
          geometry.computeVertexNormals();
          // 判断模型是否自带颜色
          var colors = geometry?.attributes?.color?.array || [];
          let material: any = null;
          if (colors?.length) {
            // if (!sprite) {
            //     // colors 有值代表ply文件本身包含了颜色，则使用本身的颜色渲染
            //     sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            //         map: new THREE.CanvasTexture(lut.createCanvas())
            //     }));
            //     sprite.material.map.colorSpace = THREE.SRGBColorSpace;
            //     sprite.scale.x = 0.125;
            //     sprite.position.set(1.4, 0, 0);
            //     uiScene.current.add(sprite);
            // }
            setMeshHasColor(true);
            material = new THREE.MeshBasicMaterial({
              // MeshStandardMaterial,MeshBasicMaterial,PointsMaterial
              vertexColors: true,
            });
          } else {
            setMeshHasColor(false);
            /** 没有颜色则手动添加
             *  金色：#ffd700
             *  银色：#c0c0c0
             *  铜色：#b87333
             *  钢色：#808080
             *  铝色：#c3c3c3
             *  蓝色：#55fdfd
             * */
            material = new THREE.MeshStandardMaterial({
              // MeshStandardMaterial,MeshBasicMaterial,PointsMaterial
              color: addType === 'add' ? '#55fdfd' : '#808080',
            });
          }
          const mesh = new THREE.Mesh(geometry, material); // Points,Mesh
          addPickable(mesh);
        },
        (xhr) => processFun(xhr),
        (error) => processError(error),
      );
    } else if (name?.indexOf('.stl') > -1) {
      new STLLoader().load(
        name,
        function (geometry) {
          geometry.computeVertexNormals();
          const material: any = new THREE.MeshPhysicalMaterial({
            color: 0xff9c7c,
          });

          const mesh = new THREE.Mesh(geometry, material);
          addPickable(mesh);
        },
        (xhr) => processFun(xhr),
        (error) => processError(error),
      );
    } else if (name?.indexOf('.obj') > -1) {
      new OBJLoader().load(
        name,
        function (object) {
          addPickable(object);
        },
        (xhr) => processFun(xhr),
        (error) => processError(error),
      );
    } else if (name?.indexOf('.json') > -1) {
      sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(lut.createCanvas()),
        }),
      );
      sprite.material.map.colorSpace = THREE.SRGBColorSpace;
      sprite.scale.x = 0.125;
      uiScene.current.add(sprite);

      const loader = new THREE.BufferGeometryLoader(manager);
      loader.load(
        name,
        function (geometry) {
          geometry.computeVertexNormals();
          // default color attribute
          const colors = [];
          for (let i = 0, n = geometry.attributes.position.count; i < n; ++i) {
            colors.push(1, 1, 1);
          }
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          const mesh = new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
              // side: THREE.DoubleSide,
              // color: 0xf5f5f5,
              vertexColors: true,
            }),
          );
          lut.setColorMap('rainbow');
          lut.setMax(2000);
          lut.setMin(0);

          const pressures = geometry.attributes.pressure;
          const colorsUpdate = geometry.attributes.color;
          const color = new THREE.Color();
          for (let i = 0; i < pressures.array.length; i++) {
            const colorValue = pressures.array[i];
            color.copy(lut.getColor(colorValue)).convertSRGBToLinear();
            colorsUpdate.setXYZ(i, color.r, color.g, color.b);
          }
          colorsUpdate.needsUpdate = true;
          const map = sprite.material.map;
          lut.updateCanvas(map.image);
          map.needsUpdate = true;
          addPickable(mesh);
        },
        (xhr) => processFun(xhr),
        (error) => processError(error),
      );
    } else if (name?.indexOf('.mtl') > -1) {
      // new MTLLoader(manager).load(
      //     myobj.mtl,
      //     function (materials) {
      //         materials.preload();
      //         new OBJLoader(manager)
      //             .setMaterials(materials)
      //             .load(myobj.obj,
      //                 function (object) {
      //                     scene.add(object);
      //                 },
      //                 (xhr) => processFun(xhr),
      //                 (error) => {
      //                     processError(error);
      //                 }
      //             );
      //     }
      // );
    }
  };
  // 获取模型实际尺寸
  const getSize = () => {
    let maxX: any = [],
      maxY: any = [],
      maxZ: any = [],
      minX: any = [],
      minY: any = [],
      minZ: any = [];
    const models = getAllModelsFromScene(scene.current);
    (models || []).forEach?.((mesh: any) => {
      const box = new THREE.Box3().setFromObject(mesh); // 获取模型的包围盒
      maxX.push(box.max.x);
      maxY.push(box.max.y);
      maxZ.push(box.max.z);
      minX.push(box.min.x);
      minY.push(box.min.y);
      minZ.push(box.min.z);
    });
    const boxXmax = Math.max(...maxX);
    const boxXmin = Math.min(...minX);
    const boxYmax = Math.max(...maxY);
    const boxYmin = Math.min(...minY);
    const boxZmax = Math.max(...maxZ);
    const boxZmin = Math.min(...minZ);
    const length = boxXmax - boxXmin; // 模型长度
    const width = boxZmax - boxZmin; // 模型宽度
    const height = boxYmax - boxYmin; // 模型高度
    const max = Math.max(boxXmax, boxYmax, boxZmax);
    let cameraScale = 1.6;
    if (!!localStorage.getItem('cameraScale')) {
      cameraScale = Number(localStorage.getItem('cameraScale'));
    }
    camera.current.zoom = cameraScale;
    return { length, width, height, max, cameraScale };
  };
  // 点云截图
  const captureScreenshot = (type?: any) => {
    return new Promise((resolve, reject) => {
      // 将射线隐藏
      (measurements || []).forEach?.((line: any) => {
        scene.current?.remove?.(line);
      });
      // requestAnimationFrame 确保截图在页面完全加载和渲染之后进行
      requestAnimationFrame(function () {
        const box: any = renderer.current.domElement;
        var imageDataURL = box?.toDataURL('image/png');
        if (type === 'download') {
          var link = document.createElement('a');
          link.href = imageDataURL;
          link.download = `output_${uuid()}.png`;
          link.click();
        }
        // 将射线显示回来
        (measurements || []).forEach?.((line: any) => {
          scene.current?.add?.(line);
        });
        imageDataURL = imageDataURL.split('data:image/png;base64,')[1];
        resolve(imageDataURL);
      });
    });
  };
  // 旋转视角-自动截图
  const loopScreenshot = (list: any, index: number, basicPosition: any, processText: any) => {
    if (index + 1 > list.length) {
      animateCamera(basicPosition);
      processText.style.display = 'none';
      return;
    }
    animateCamera(list[index], 500);
    captureScreenshot().then((base64: any) => {
      // 首先走保存
      if (!!fetchType && !!xName) {
        btnFetch(
          fetchType,
          xName,
          { image: encodeURIComponent(base64) },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            // 然后走循环
            setTimeout(() => {
              loopScreenshot(list, index + 1, basicPosition, processText);
            }, cameraSwitchTime * 1000);
          } else {
            message.error('截图上传时，接口报错', 5);
            animateCamera(basicPosition);
            processText.style.display = 'none';
          }
        });
      }
    });
  };
  // 不同视角点击函数
  const animationClick = (targetPos: any) => {
    // 先停止自动旋转
    setCameraSwitch(false);
    // 然后旋转视角
    animateCamera(targetPos);
  };
  // 动态旋转视角
  const animateCamera = (targetPos: any, timehost = 1000) => {
    if (!!camera?.current && camera?.current?.position) {
      var currentPos = camera.current.position;
      var tween = new TWEEN.Tween(currentPos)
        .to(targetPos, timehost)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
          camera?.current?.position?.copy?.(currentPos);
          camera?.current?.lookAt?.(0, 0, 0);
        });
      tween.start();
    }
  };
  // 自动旋转函数
  const cameraRotate = (list: any, index: number) => {
    if (cameraRef?.current) {
      clearTimeout(cameraRef?.current);
    }
    if (index + 1 > list.length) {
      return;
    }
    animateCamera(list[index]);
    cameraRef.current = setTimeout(() => {
      console.log(index, cameraSwitchTime);
      cameraRotate(list, index + 1 === list.length ? 0 : index + 1);
    }, cameraSwitchTime * 1000);
  };
  useEffect(() => {
    const mesh: any = scene?.current?.getObjectByName?.('tx-0');
    if (!scene.current || !mesh) {
      return;
    }
    const { length, width, height, max, cameraScale } = getSize();
    var cameraList = [
      new THREE.Vector3(max * -cameraScale, 0, 0),
      new THREE.Vector3(0, 0, max * cameraScale),

      new THREE.Vector3(0, max * cameraScale, 0),
      new THREE.Vector3(0, 0, max * cameraScale),
      new THREE.Vector3(0, max * -cameraScale, 0),

      new THREE.Vector3(max * cameraScale, 0, 0),
      new THREE.Vector3(0, 0, max * -cameraScale),

      new THREE.Vector3(width, height, length),
    ];
    if (cameraRef?.current) {
      clearTimeout(cameraRef?.current);
    }

    if (cameraSwitch) {
      if (cameraRef?.current) {
        clearTimeout(cameraRef?.current);
      }
      cameraRotate(cameraList, 0);
    } else {
      if (cameraRef?.current) {
        clearTimeout(cameraRef?.current);
      }
      cameraRotate(cameraList, cameraList.length);
    }

    return () => {
      if (cameraRef?.current) {
        clearTimeout(cameraRef?.current);
      }
      cameraRotate(cameraList, cameraList.length);
    };
  }, [scene.current, cameraSwitch, cameraSwitchTime]);

  return (
    <div id={`echart-${id}`} className={`${styles.threeCharts} flex-box`} style={{ fontSize }}>
      <div id="instructions" className="flex-box-justify-between">
        <div className="flex-box"></div>
        <div className="flex-box" style={{ flex: 1 }}>
          <Tooltip title="比例尺">
            <Popover
              content={
                <div className="flex-box">
                  <Input
                    style={{ maxWidth: 100 }}
                    placeholder="比例尺"
                    onBlur={(e) => {
                      const res = JSON.parse(localStorage.getItem('scale') || '{}');
                      const val = e.target.value;
                      localStorage.setItem('scale', JSON.stringify({ ...res, value: val }));
                    }}
                    defaultValue={JSON.parse(localStorage.getItem('scale') || '{}')?.value || 1}
                  />
                  <Select
                    style={{ width: 125, minWidth: 125 }}
                    onChange={(val) => {
                      const res = JSON.parse(localStorage.getItem('scale') || '{}');
                      localStorage.setItem('scale', JSON.stringify({ ...res, unit: val }));
                    }}
                    defaultValue={JSON.parse(localStorage.getItem('scale') || '{}')?.unit || 'm'}
                    options={[
                      {
                        value: 'mm',
                        label: '毫米（mm）',
                      },
                      {
                        value: 'cm',
                        label: '厘米（cm）',
                      },
                      {
                        value: 'm',
                        label: '米（m）',
                      },
                    ]}
                  />
                </div>
              }
              title="设置比例尺"
              trigger="click"
            >
              <Button icon={<FontSizeOutlined />} className="btn" />
            </Popover>
          </Tooltip>
          <Tooltip title="标注">
            <Button
              icon={<AimOutlined />}
              type={selectedBtn.includes('bzBtn01') ? 'primary' : 'default'}
              id="bzBtn01"
              className="btn"
            />
          </Tooltip>
          <Tooltip title="显示边框">
            <Button
              icon={<BorderOuterOutlined />}
              type={selectedBtn.includes('bzBtn02') ? 'primary' : 'default'}
              id="bzBtn02"
              className="btn"
            />
          </Tooltip>
          <Tooltip title="显示坐标轴">
            <Button
              icon={<BorderlessTableOutlined />}
              type={selectedBtn.includes('bzBtn03') ? 'primary' : 'default'}
              id="bzBtn03"
              className="btn"
            />
          </Tooltip>
          <Tooltip title="开启透视">
            <Button
              icon={<EyeOutlined />}
              type={selectedBtn.includes('bzBtn04') ? 'primary' : 'default'}
              id="bzBtn04"
              className="btn"
            />
          </Tooltip>
          <Tooltip title="清理测距数据">
            <Button icon={<ClearOutlined />} type={'default'} id="bzBtn05" className="btn" />
          </Tooltip>
          <Tooltip title="截图">
            <Button icon={<ScissorOutlined />} type={'default'} id="bzBtn08" className="btn" />
          </Tooltip>
          <Tooltip title={!!selectedPath ? '清除上传的文件' : '上传本地点云文件'}>
            {!!selectedPath ? (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedPath('');
                }}
              />
            ) : (
              <Button
                icon={<UploadOutlined />}
                onClick={() => {
                  setSelectPathVisible(true);
                }}
              />
            )}
          </Tooltip>
        </div>
        <div className="flex-box">
          <Tooltip title="缩小">
            <Button icon={<MinusOutlined />} id="bzBtn06" className="btn" />
          </Tooltip>
          <Tooltip title="放大">
            <Button icon={<PlusOutlined />} id="bzBtn07" className="btn" />
          </Tooltip>
        </div>
      </div>

      <div
        className="render-dom"
        // @ts-ignore
        ref={dom}
      >
        <div className="three-mask flex-box" style={{ display: 'none' }}>
          <progress className="process" value="0"></progress>
          <span className="process-text">0%</span>
        </div>
        <canvas id="demoBox"></canvas>
      </div>
      {useMemo(() => {
        return ifShowColorList && meshHasColor ? (
          <div className="sprite-box flex-box">
            <div className="number-box flex-box-justify-between">
              {[2, 1.5, 1, 0.5, '0.0', -0.5, -1, -1.5, -2]?.map?.((item: any, index: number) => {
                return (
                  <div
                    className="number-item"
                    key={`number-${index}`}
                    style={
                      index === 0 || index === 8 || index === 4
                        ? { fontWeight: 600 }
                        : { opacity: 0.7 }
                    }
                    onClick={() => {
                      console.log(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>

            <div className="sprite-icon" />
          </div>
        ) : null;
      }, [meshHasColor, ifShowColorList])}
      {/* <img src={spriteImg} alt="sprite" className='sprite-icon' onClick={(e: any) => {
                const { clientX, clientY, target } = e;
                console.log(e)
                console.log('点击的box的大小', target.clientHeight, target.clientWidth);
                console.log('实际点击的位置', clientX - target.offsetLeft, clientY - target.offsetTop);
            }} /> */}
      <div className="camera-box">
        <div className="camera-box-pointer">
          {modelRotate ? (
            <div className="camera-box-pointer-head flex-box-justify-between">
              <InputNumber
                size="small"
                addonAfter="秒"
                value={cameraSwitchTime}
                max={100}
                min={1}
                onChange={(val: any) => {
                  setCameraSwitchTime(val);
                }}
              />
              <Switch
                className="cameraIcon-switch"
                checked={cameraSwitch}
                onChange={(e) => setCameraSwitch(e)}
              />
            </div>
          ) : null}
          <div className="camera-box-pointer-top flex-box-justify-between">
            <img
              src={rectTopIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(0, max * cameraScale, 0);
                animationClick(targetPos);
              }}
            />
            <img
              src={rectAllIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { length, width, height } = getSize();
                var targetPos = new THREE.Vector3(width, height, length);
                animationClick(targetPos);
              }}
            />
          </div>
          <div className="camera-box-pointer-center flex-box-justify-between">
            <img
              src={rectLeftIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(max * -cameraScale, 0, 0);
                animationClick(targetPos);
              }}
            />
            <img
              src={rectFrontIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(0, 0, max * cameraScale);
                animationClick(targetPos);
              }}
            />
            <img
              src={rectRightIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(max * cameraScale, 0, 0);
                animationClick(targetPos);
              }}
            />
            <img
              src={rectBackIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(0, 0, max * -cameraScale);
                animationClick(targetPos);
              }}
            />
          </div>
          <div className="camera-box-pointer-bottom flex-box-justify-between">
            <img
              src={rectBottomIcon}
              alt="rect"
              className="cameraIcon"
              onClick={() => {
                const { max, cameraScale } = getSize();
                var targetPos = new THREE.Vector3(0, max * -cameraScale, 0);
                animationClick(targetPos);
              }}
            />
          </div>
        </div>
        <div className="camera-box-cursor flex-box">
          <img src={rectIcon} alt="rect" className="cameraIcon" />
          视图
        </div>
      </div>

      {selectPathVisible ? (
        <FileManager
          onOk={(val: any) => {
            const { value } = val;
            setSelectedPath(`http://localhost:8866/file/${value}`);
            setSelectPathVisible(false);
          }}
          onCancel={() => {
            setSelectPathVisible(false);
            setSelectedPath('');
          }}
        />
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(ThreeCharts);
