import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { Button, Input, message, Popover, Select, Tooltip } from 'antd';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import TWEEN from '@tweenjs/tween.js';
import h337 from '@rengr/heatmap.js'
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
    AimOutlined,
    BorderlessTableOutlined, BorderOuterOutlined, EyeOutlined, FontSizeOutlined, PlusOutlined
} from '@ant-design/icons';
import rectIcon from '@/assets/imgs/rect.svg';
import rectAllIcon from '@/assets/imgs/rect-all.svg';
import rectLeftIcon from '@/assets/imgs/rect-left.svg';
import rectRightIcon from '@/assets/imgs/rect-right.svg';
import rectTopIcon from '@/assets/imgs/rect-top.svg';
import rectBottomIcon from '@/assets/imgs/rect-bottom.svg';
import rectFrontIcon from '@/assets/imgs/rect-front.svg';
import rectBackIcon from '@/assets/imgs/rect-back.svg';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ThreeCharts: React.FC<Props> = (props: any) => {
    // models/ply/ascii/tx.ply / models/obj/walt/tx.obj / models/stl/ascii/tx.stl
    const { data = {}, id, } = props;
    const { dataValue = {}, fontSize } = data;
    let { name, value = [] } = dataValue;
    if (process.env.NODE_ENV === 'development') {
        name = "models/tx.stl";
        value = [
            { name: "7", standardValue: "536", measureValue: "562.365", offsetValue: "0.765", position: [{ x: -400, y: 0, z: 500 }, { x: 400, y: 0, z: 500 },], }
        ];
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const dom = useRef<any>();
    const [selectedBtn, setSelectedBtn] = useState(['']);

    useEffect(() => {
        if (!_.isString(name)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
    }, [name]);

    let renderer = useRef<any>();
    const labelRenderer = new CSS2DRenderer();
    let scene = useRef<any>(),
        camera = useRef<any>(),
        controls = useRef<any>(),
        stats = useRef<any>(),
        animateId: number = 0;
    // 定义常变量
    let ctrlDown = false;
    let lineId = 0;
    let line: any;
    let drawingLine = false;
    const raycaster = new THREE.Raycaster();
    let intersects;
    const mouse = new THREE.Vector2();
    const measurementLabels = {};
    // loader后能被标注的点云
    const pickableObjects = new Array();

    if (!localStorage.getItem("scale")) {
        localStorage.setItem("scale", JSON.stringify({ value: "1", unit: "m" }));
    }

    useEffect(() => {
        if (!name) return;
        // 蒙层
        const maskBox: any = document.querySelector(".three-mask");
        // 外层盒子
        const box: any = dom?.current;
        // 渲染场景盒子
        const canvas: any = document.querySelector("#demoBox");
        // 按钮-标注
        const bzBtn01: any = document.querySelector("#bzBtn01");
        // 按钮-框选
        const bzBtn02: any = document.querySelector("#bzBtn02");
        // 按钮-坐标轴
        const bzBtn03: any = document.querySelector("#bzBtn03");
        // 按钮-透视
        const bzBtn04: any = document.querySelector("#bzBtn04");
        // 初始化dom
        renderer.current = new THREE.WebGLRenderer({ canvas });
        renderer.current.shadowMap.enabled = true;
        renderer.current.outputEncoding = THREE.sRGBEncoding;
        renderer.current.setSize(box.offsetWidth, box.offsetHeight);
        box.appendChild(renderer.current.domElement);
        labelRenderer.setSize(box.offsetWidth, box.offsetHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.pointerEvents = "none";
        labelRenderer.domElement.style['font-size'] = 'inherit';
        box.appendChild(labelRenderer.domElement);
        // @ts-ignore 左上角，内存占用显示 
        stats.current = new Stats();
        stats.current.dom.style.position = "absolute";
        // stats.dom.style.top = "28px";
        box.appendChild(stats.current.dom);
        // 场景
        scene.current = new THREE.Scene();
        // 坐标轴（右手定则，大拇指是x）
        const axesHelper = new THREE.AxesHelper(1000);
        axesHelper.name = "axis";
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
            light3.position.set(0, 0, 0);
            scene.current.add(light3);
        }
        // 相机
        camera.current = new THREE.PerspectiveCamera(
            75,
            canvas.offsetWidth / canvas.offsetHeight,
            0.1,
            1000000
        );
        camera.current.position.set(1000, -1400, 0);
        // 控制器 (旋转/缩放)
        controls.current = new OrbitControls(camera.current, renderer.current.domElement);
        controls.current.enableDamping = true;
        // 开始渲染
        const startTime = +new Date();
        const timeHost = () => {
            const endTime = +new Date();
            console.log("模型加载渲染耗时:", `${(endTime - startTime) / 1000}s`);
        };
        function addPickable(mesh: any) {
            timeHost();
            mesh.name = "tx";
            if (mesh?.material) {
                mesh.material.side = THREE.DoubleSide;
            } else if (mesh.children?.[0] && !!mesh.children[0]?.material) {
                mesh.children[0].material.side = THREE.DoubleSide;
            }
            // 边框
            const border = new THREE.BoxHelper(mesh, 0x00ffff); //object 模型
            border.name = "border";
            border.visible = false;
            mesh.attach(border);
            // 居中显示
            let box = new THREE.Box3().setFromObject(mesh); // 获取模型的包围盒
            let mdlen = box.max.x - box.min.x; // 模型长度
            let mdwid = box.max.z - box.min.z; // 模型宽度
            let mdhei = box.max.y - box.min.y; // 模型高度
            let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
            let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
            let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
            mesh.position.set(-x1, -y1, -z1); // 将模型进行偏移
            // 把点云放到可控数组里，用于画线标注
            mesh.frustumCulled = false;
            mesh.traverse(function (child: any) {
                if (child.isMesh) {
                    child.frustumCulled = false;
                    let m = child;
                    switch (m.name) {
                        case "Plane":
                            m.receiveShadow = true;
                            break;
                        default:
                            m.castShadow = true;
                    }
                    pickableObjects.push(m);
                }
            });
            maskBox.style.display = "none";

            camera.current.position.set(0, -1.5 * mdlen, 0);
            scene.current.add(mesh);
        }
        function processFun(xhr: any) {
            const { loaded = 0, total = 1 } = xhr;
            const processBox = maskBox.querySelector('.process');
            const processText = maskBox.querySelector('.process-text');

            const process = `${((loaded / total) * 100 + '').slice(0, 5)}%`;
            const percentComplete = (xhr.loaded / xhr.total) * 100
            processBox.value = loaded / total;
            processText.innerText = process;
        }
        // 加载url
        if (name.indexOf(".glb") > -1) {
            new GLTFLoader().load(
                name,
                function (gltf) {
                    addPickable(gltf.scene);
                },
                (xhr) => processFun(xhr)
            );
        } else if (name.indexOf(".ply") > -1) {
            new PLYLoader().load(
                name,
                function (geometry) {
                    geometry.computeVertexNormals();
                    const material: any = new THREE.MeshStandardMaterial({
                        color: 0x009cff,
                    });

                    const mesh = new THREE.Mesh(geometry, material);
                    addPickable(mesh);
                },
                (xhr) => processFun(xhr),
                (error) => {
                    console.log(error);
                }
            );
        } else if (name.indexOf(".stl") > -1) {
            // 热力图着色器程序
            const vertexShader = `
                varying vec2 vUv;

                void main() {
                vUv = uv;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform float iGlobalTime;
                uniform sampler2D textureData;

                varying vec2 vUv;

                void main() {
                vec4 color = texture2D(textureData, vUv);
                vec3 heatColor = vec3(1.0, 1.0 - color.r, 1.0 - color.r * color.r);
                gl_FragColor = vec4(heatColor, 1.0);
                }
            `;
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
                (xhr) => processFun(xhr)
            );
        } else if (name.indexOf(".obj") > -1) {
            new OBJLoader().load(
                name,
                function (object) {
                    addPickable(object);
                },
                (xhr) => processFun(xhr)
            );
        }
        // 取消标注的公共方法
        function cancelMeasurement() {
            ctrlDown = false;
            controls.current.enabled = true;
            renderer.current.domElement.style.cursor = "pointer";
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
                renderer.current.domElement.style.cursor = "crosshair";
                setSelectedBtn((prev: any) => (prev || []).concat('bzBtn01'));
            } else {
                cancelMeasurement();
            }
        };
        bzBtn01?.addEventListener("click", bzBtnFun01);
        // 边框
        function bzBtnFun02() {
            const mesh: any = scene.current.getObjectByName("tx");
            setSelectedBtn((prev: any) => {
                if ((prev || []).includes('bzBtn02')) {
                    (mesh.children || []).filter((i: any) => i.type === "BoxHelper")[0].visible = false;
                    return prev.filter((i: any) => i !== 'bzBtn02');
                } else {
                    (mesh.children || []).filter((i: any) => i.type === "BoxHelper")[0].visible = true;
                    return (prev || []).concat('bzBtn02');
                }
            });
        };
        bzBtn02?.addEventListener("click", bzBtnFun02);
        // 坐标轴
        function bzBtnFun03() {
            const axis: any = scene.current.getObjectByName("axis");
            setSelectedBtn((prev: any) => {
                if ((prev || []).includes('bzBtn03')) {
                    axis.visible = false;
                    return prev.filter((i: any) => i !== 'bzBtn03');
                } else {
                    axis.visible = true;
                    return (prev || []).concat('bzBtn03');
                }
            });
        };
        bzBtn03?.addEventListener("click", bzBtnFun03);
        // 透视
        function bzBtnFun04() {
            const mesh: any = scene.current.getObjectByName("tx");
            if (!!mesh.material) {
                const depth = mesh.material?.depthTest;
                if (depth) {
                    mesh.material.depthTest = false;
                    setSelectedBtn((prev: any) => (prev || []).concat('bzBtn04'));
                } else {
                    mesh.material.depthTest = true;
                    setSelectedBtn((prev: any) => prev.filter((i: any) => i !== 'bzBtn04'));
                }
            } else if (mesh.children.filter((i: any) => i.type === "Points")[0]) {
                const depth = mesh.children.filter((i: any) => i.type === "Points")[0]?.material?.depthTest;
                if (!!mesh.children.filter((i: any) => i.type === "Points")[0]?.material) {
                    if (depth) {
                        mesh.children.filter((i: any) => i.type === "Points")[0].material.depthTest = false;
                        setSelectedBtn((prev: any) => (prev || []).concat('bzBtn04'));
                    } else {
                        mesh.children.filter((i: any) => i.type === "Points")[0].material.depthTest = true;
                        setSelectedBtn((prev: any) => prev.filter((i: any) => i !== 'bzBtn04'));
                    }
                }
            }
        };
        bzBtn04?.addEventListener("click", bzBtnFun04);
        // 取消标注
        window.addEventListener("keyup", function (event) {
            if (event.key === "Escape") {
                cancelMeasurement();
            }
        });
        function onMouseDown(event: any) {
            if (ctrlDown) {
                raycaster.setFromCamera(mouse, camera.current);
                intersects = raycaster.intersectObjects(pickableObjects, false);
                if (intersects.length > 0) {
                    if (!drawingLine) {
                        //start the line
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
                            })
                        );
                        line.frustumCulled = false;
                        scene.current.add(line);
                        const measurementDiv = document.createElement("div");
                        measurementDiv.className = "measurementLabel";
                        measurementDiv.innerText = "start";
                        const measurementLabel: any = new CSS2DObject(measurementDiv);
                        measurementLabel.position.copy(intersects[0].point);
                        measurementLabels[lineId] = measurementLabel;
                        scene.current.add(measurementLabels[lineId]);
                        drawingLine = true;
                    } else {
                        //finish the line
                        const positions = line.geometry.attributes.position.array;
                        positions[3] = intersects[0].point.x;
                        positions[4] = intersects[0].point.y;
                        positions[5] = intersects[0].point.z;
                        line.geometry.attributes.position.needsUpdate = true;
                        lineId++;
                        drawingLine = false;
                    }
                } else {
                    console.log(intersects);
                }
            } else {
                event.preventDefault();
                mouse.x = (event.offsetX / renderer.current?.domElement.offsetWidth) * 2 - 1;
                mouse.y = -(event.offsetY / renderer.current?.domElement.offsetHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera.current);
                intersects = raycaster.intersectObjects(pickableObjects, false);

                // 显示边框
                const mesh: any = scene.current.getObjectByName("tx");
                const axis: any = scene.current.getObjectByName("axis");
                (mesh.children || []).filter((i: any) => i.type === "BoxHelper")[0].visible = true;
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
                    const v0 = new THREE.Vector3(
                        positions[0],
                        positions[1],
                        positions[2]
                    );
                    const v1 = new THREE.Vector3(
                        intersects[0].point.x,
                        intersects[0].point.y,
                        intersects[0].point.z
                    );
                    positions[3] = intersects[0].point.x;
                    positions[4] = intersects[0].point.y;
                    positions[5] = intersects[0].point.z;
                    line.geometry.attributes.position.needsUpdate = true;
                    const distance = v0.distanceTo(v1);
                    let scale = { value: 1, unit: "m" };
                    try {
                        scale = JSON.parse(localStorage.getItem("scale") || JSON.stringify({ value: 1, unit: "m" }));
                    } catch (err) {
                        console.log('localStorge中的scale格式不对', err);
                    }
                    measurementLabels[lineId].element.innerText =
                        (distance * Number(scale?.value || "1")).toFixed(2) + (scale?.unit || "m");
                    measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
                }
            }
        }
        function onMouseUp() {
            if (!renderer.current) return;
            const mesh: any = scene.current.getObjectByName("tx");
            const axis: any = scene.current.getObjectByName("axis");
            setSelectedBtn((prev: any) => {
                if (!(prev || []).includes('bzBtn02')) {
                    // 隐藏边框
                    (mesh.children || []).filter((i: any) => i.type === "BoxHelper")[0].visible = false;
                }
                if (!(prev || []).includes('bzBtn03')) {
                    // 隐藏坐标轴
                    axis.visible = false;
                }
                return prev;
            });
        }
        renderer.current.domElement.addEventListener("pointerdown", onMouseDown, false);
        renderer.current.domElement.addEventListener("pointerup", onMouseUp, false);
        renderer.current.domElement.addEventListener("mousemove", onDocumentMouseMove, false);
        var animate = function () {
            animateId = requestAnimationFrame(animate);
            controls && controls.current.update();
            render();
            TWEEN.update();
            !!stats.current && stats.current.update();
        };
        function render() {
            labelRenderer.render(scene.current, camera.current);
            renderer.current.render(scene.current, camera.current);
        }
        animate();

        return () => {
            bzBtn01.removeEventListener('click', bzBtnFun01);
            bzBtn02.removeEventListener('click', bzBtnFun02);
            bzBtn03.removeEventListener('click', bzBtnFun03);
            bzBtn04.removeEventListener('click', bzBtnFun04);
            cancelAnimationFrame(animateId);
            dom?.current?.removeChild(stats.current.dom);
            scene.current.traverse((child: any) => {
                console.log(child)
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
                child = null;
            });

            // 场景中的参数释放清理或者置空等
            if (!!dom.current && dom.current.innerHTML) {
                dom.current.innerHTML = `
                    <div class="three-mask flex-box">
                        <progress class='process' value="0" />
                        <span class='process-text'>0%</span>
                    </div>
                    <canvas id="demoBox" />
                `;
            }
            renderer.current.domElement.innerHTML = '';
            // renderer.current.forceContextLoss();
            renderer.current.dispose();
            // dom.current.removeChild(renderer.current.domElement);
            // dom.current.removeChild(labelRenderer.domElement);
            scene.current?.clear();
            scene.current = undefined;
            stats.current = undefined;
            camera.current = undefined;
            controls.current = undefined;
            renderer.current.domElement = undefined;
            renderer.current = undefined;
            setSelectedBtn([]);
            console.log('clearScene');
        };
    }, [name]);
    useEffect(() => {
        (value || []).forEach((item: any, index: number) => {
            const { name, standardValue, measureValue, offsetValue, position } = item;
            // @ts-ignore 渲染线
            const geometry = new THREE.BufferGeometry().setFromPoints(position);
            line = new THREE.LineSegments(
                geometry,
                new THREE.LineBasicMaterial({
                    color: 0xff0000, // 射线颜色
                    transparent: true,
                    opacity: 0.75,
                    // depthTest: false,
                    // depthWrite: false,
                })
            );
            line.frustumCulled = false;
            scene.current.add(line);
            // 渲染信息卡片
            const measurementDiv = document.createElement("div");
            measurementDiv.className = "label";
            measurementDiv.innerHTML = `
             <div class="item">长度尺寸: ${name}</div>
             <div class="item" style="text-align:center;">${standardValue} ± ${offsetValue}</div>
             <div class="flex-box item"><div class="key">名义值</div><div class="value">${standardValue}</div></div>
             <div class="flex-box item"><div class="key">实测值</div><div class="value">${measureValue}</div></div>
             <div class="flex-box item"><div class="key">偏差值</div><div class="value">${offsetValue}</div></div>
             `;
            const measurementLabel: any = new CSS2DObject(measurementDiv);
            measurementLabel.position.copy({
                x: (position[0].x + position[1].x) / 2,
                y: (position[0].y + position[1].y) / 2,
                z: (position[0].z + position[1].z) / 2,
            });
            measurementLabels["label" + index] = measurementLabel;
            scene.current.add(measurementLabels["label" + index]);
        });
    }, [value]);
    // 获取模型实际尺寸
    const getSize = () => {
        const mesh: any = scene.current.getObjectByName("tx");
        const box = new THREE.Box3().setFromObject(mesh); // 获取模型的包围盒
        const length = box.max.x - box.min.x; // 模型长度
        const width = box.max.z - box.min.z; // 模型宽度
        const height = box.max.y - box.min.y; // 模型高度
        const max = Math.max(length, width, height);
        return { length, width, height, max };
    };
    // 动态旋转视角
    const animateCamera = (targetPos: any) => {
        var currentPos = camera.current.position;
        console.log(currentPos, targetPos)
        var tween = new TWEEN.Tween(currentPos)
            .to(targetPos, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
                camera.current.position.copy(currentPos);
                camera.current.lookAt(0, 0, 0);
            });
        tween.start();
    };

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.threeCharts} flex-box`}
            style={{ fontSize }}
        >
            <div id="instructions" className="flex-box">
                <Tooltip title="比例尺">
                    <Popover
                        content={
                            <div className='flex-box'>
                                <Input
                                    style={{ maxWidth: 100 }}
                                    placeholder="比例尺"
                                    onBlur={(e) => {
                                        const res = JSON.parse(localStorage.getItem("scale") || "{}");
                                        const val = e.target.value;
                                        localStorage.setItem("scale", JSON.stringify({ ...res, value: val }));
                                    }}
                                    defaultValue={JSON.parse(localStorage.getItem("scale") || "{}")?.value || 1}
                                />
                                <Select
                                    style={{ width: 125, minWidth: 125 }}
                                    onChange={(val) => {
                                        const res = JSON.parse(localStorage.getItem("scale") || "{}");
                                        localStorage.setItem("scale", JSON.stringify({ ...res, unit: val }));
                                    }}
                                    defaultValue={JSON.parse(localStorage.getItem("scale") || "{}")?.unit || 'm'}
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
                                        }
                                    ]}
                                />
                            </div>
                        }
                        title="设置比例尺"
                        trigger="click"
                    >
                        <Button
                            icon={<FontSizeOutlined />}
                            className='btn'
                        />
                    </Popover>
                </Tooltip>
                <Tooltip title="标注">
                    <Button
                        icon={<AimOutlined />}
                        type={selectedBtn.includes('bzBtn01') ? 'primary' : 'default'}
                        id="bzBtn01"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="显示边框">
                    <Button
                        icon={<BorderOuterOutlined />}
                        type={selectedBtn.includes('bzBtn02') ? 'primary' : 'default'}
                        id="bzBtn02"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="显示坐标轴">
                    <Button
                        icon={<BorderlessTableOutlined />}
                        type={selectedBtn.includes('bzBtn03') ? 'primary' : 'default'}
                        id="bzBtn03"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="开启透视">
                    <Button
                        icon={<EyeOutlined />}
                        type={selectedBtn.includes('bzBtn04') ? 'primary' : 'default'}
                        id="bzBtn04"
                        className='btn'
                    />
                </Tooltip>
            </div>

            <div
                className='render-dom'
                // @ts-ignore
                ref={dom}
            >
                <div className="three-mask flex-box">
                    <progress className='process' value="0" />
                    <span className='process-text'>0%</span>
                </div>
                <canvas id="demoBox"></canvas>
            </div>
            <div className='camera-box'>
                <div className="camera-box-pointer">
                    <div className="camera-box-pointer-top flex-box-justify-between">
                        <img src={rectTopIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(0, max * 1.5, 0);
                            animateCamera(targetPos);
                        }} />
                        <img src={rectAllIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { length, width, height } = getSize();
                            var targetPos = new THREE.Vector3(width, height, length);
                            animateCamera(targetPos);
                        }} />
                    </div>
                    <div className="camera-box-pointer-center flex-box-justify-between">
                        <img src={rectLeftIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(max * -1.5, 0, 0);
                            animateCamera(targetPos);
                        }} />
                        <img src={rectFrontIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(0, 0, max * 1.5);
                            animateCamera(targetPos);
                        }} />
                        <img src={rectRightIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(max * 1.5, 0, 0);
                            animateCamera(targetPos);
                        }} />
                        <img src={rectBackIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(0, 0, max * -1.5);
                            animateCamera(targetPos);
                        }} />
                    </div>
                    <div className="camera-box-pointer-bottom flex-box-justify-between">
                        <img src={rectBottomIcon} alt="rect" className='cameraIcon' onClick={() => {
                            const { max } = getSize();
                            var targetPos = new THREE.Vector3(0, max * -1.5, 0);
                            animateCamera(targetPos);
                        }} />
                    </div>
                </div>
                <div className="camera-box-cursor flex-box">
                    <img src={rectIcon} alt="rect" className='cameraIcon' />
                    视图
                </div>
            </div>
        </div>
    );

};

export default ThreeCharts;