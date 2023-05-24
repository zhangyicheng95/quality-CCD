import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { Button, Input, message, Tooltip } from 'antd';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { BorderlessTableOutlined, BorderOuterOutlined, EyeOutlined, FontSizeOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ThreeCharts: React.FC<Props> = (props: any) => {
    // models/ply/ascii/tx.ply / models/obj/walt/tx.obj / models/stl/ascii/tx.stl
    let { data = {}, id, } = props;
    let { dataValue, fontSize } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = "models/tx.stl";
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const dom = useRef<any>();
    const [selectedBtn, setSelectedBtn] = useState('');

    useEffect(() => {
        if (!_.isString(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
    }, [dataValue]);

    let renderer = useRef<any>();
    const labelRenderer = new CSS2DRenderer();
    let scene = useRef<any>(),
        camera = useRef<any>(),
        controls = useRef<any>(),
        stats: any = null,
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
        localStorage.setItem("scale", "10");
    }
    var animate = function () {
        animateId = requestAnimationFrame(animate);
        controls && controls.current.update();
        render();
        !!stats && stats.update();
    };
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
                measurementLabels[lineId].element.innerText =
                    (distance * (Number(localStorage.getItem("scale")) || 1)).toFixed(2) + "m";
                measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
            }
        }
    }
    function onClick(event: any) {
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
        }
    }
    function render() {
        labelRenderer.render(scene.current, camera.current);
        renderer.current.render(scene.current, camera.current);
    }
    function main(url: string) {
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
        stats = new Stats();
        stats.dom.style.position = "absolute";
        // stats.dom.style.top = "28px";
        box.appendChild(stats.dom);
        // 场景
        scene.current = new THREE.Scene();
        // 坐标轴（右手定则，大拇指是x）
        const axesHelper = new THREE.AxesHelper(500);
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
            console.log("渲染耗时:", `${(endTime - startTime) / 1000}s`);
        };
        function addPickable(mesh: any) {
            timeHost();
            mesh.name = "tx";
            if (mesh?.material) {
                mesh.material.side = THREE.DoubleSide;
            } else if (mesh.children?.[0] && !!mesh.children[0]?.material) {
                mesh.children[0].material.side = THREE.DoubleSide;
            }
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
            // 渲染卡片
            const data = [
                {
                    name: "14",
                    standardValue: "536",
                    trueValue: "562.365",
                    offsetValue: "0.765",
                    position: [
                        { x: -mdwid / 4, y: -mdhei / 2, z: mdlen / 4 },
                        { x: mdwid / 4, y: -mdhei / 2, z: 0 },
                    ],
                },
                {
                    name: "7",
                    standardValue: "536",
                    trueValue: "562.365",
                    offsetValue: "0.765",
                    position: [
                        { x: -mdwid / 2, y: 0, z: mdlen / 2 },
                        { x: mdwid / 2, y: 0, z: mdlen / 2 },
                    ],
                },
            ];
            data.forEach((item, index) => {
                const { name, standardValue, trueValue, offsetValue, position } = item;
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
          <div class="flex-box item"><div class="key">实测值</div><div class="value">${trueValue}</div></div>
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
            camera.current.position.set(0, -1.5 * mdlen, 0);
            scene.current.add(mesh);
        }
        function processFun(xhr: any) {
            const { loaded = 0, total = 1 } = xhr;
            // @ts-ignore
            maskBox.innerText = `${(loaded / total).toFixed(2) * 100}%`;
        }
        // 加载url
        if (url.indexOf(".glb") > -1) {
            new GLTFLoader().load(
                url,
                function (gltf) {
                    addPickable(gltf.scene);
                },
                (xhr) => processFun(xhr)
            );
        } else if (url.indexOf(".ply") > -1) {
            new PLYLoader().load(
                url,
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
        } else if (url.indexOf(".stl") > -1) {
            new STLLoader().load(
                url,
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
        } else if (url.indexOf(".obj") > -1) {
            new OBJLoader().load(
                url,
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
            setSelectedBtn('');
            if (drawingLine) {
                //delete the last line because it wasn't committed
                scene.current.remove(line);
                scene.current.remove(measurementLabels[lineId]);
                drawingLine = false;
            }
        }
        // 标注
        bzBtn01.addEventListener("click", function (event: any) {
            if (!ctrlDown) {
                ctrlDown = true;
                controls.current.enabled = false;
                renderer.current.domElement.style.cursor = "crosshair";
                setSelectedBtn('bzBtn01');
            } else {
                cancelMeasurement();
            }
        });
        // 边框
        bzBtn02.addEventListener("click", function (event: any) {
            const mesh: any = scene.current.getObjectByName("tx");
            if (mesh.children?.length) {
                mesh.children = [];
                setSelectedBtn('');
            } else {
                // 选中边框架
                const border = new THREE.BoxHelper(mesh, 0x00ffff); //object 模型
                border.name = "border";
                mesh.attach(border);
                setSelectedBtn('bzBtn02');
            }
        });
        // 坐标轴
        bzBtn03.addEventListener("click", function (event: any) {
            const axis: any = scene.current.getObjectByName("axis");
            if (axis.visible) {
                axis.visible = false;
                setSelectedBtn('');
            } else {
                axis.visible = true;
                setSelectedBtn('bzBtn03');
            }
        });
        // 透视
        bzBtn04.addEventListener("click", function (event: any) {
            const mesh: any = scene.current.getObjectByName("tx");
            const depth = mesh.material.depthTest;
            if (depth) {
                mesh.material.depthTest = false;
                setSelectedBtn('bzBtn04');
            } else {
                mesh.material.depthTest = true;
                setSelectedBtn('');
            }
        });
        // 取消标注
        window.addEventListener("keyup", function (event) {
            if (event.key === "Escape") {
                cancelMeasurement();
            }
        });
        renderer.current.domElement.addEventListener("pointerdown", onClick, false);
        renderer.current.domElement.addEventListener("mousemove", onDocumentMouseMove, false);

        animate();
    }

    useEffect(() => {
        main(dataValue);

        return () => {
            renderer.current?.dispose();
        };
    }, [dataValue]);

    useEffect(() => {
        if (camera) {
            dom?.current?.reload?.();
            camera.current.aspect = dom?.current?.clientWidth / dom?.current?.clientHeight;
            camera.current.updateProjectionMatrix();
            renderer.current.setSize(dom?.current?.clientWidth, dom?.current?.clientHeight);
            labelRenderer.setSize(dom?.current?.clientWidth, dom?.current?.clientHeight);
            labelRenderer.domElement.style.fontSize = fontSize || "12px";
            // animate();
        }
    }, [
        camera, renderer, labelRenderer, fontSize,
        dom?.current?.parentNode?.clientWidth, dom?.current?.parentNode?.clientHeight
    ]);

    const clearScene = () => {
        if (renderer.current) {
            cancelAnimationFrame(animateId);
            scene.current.traverse((child: any) => {
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
                child = null;
            });

            renderer.current?.domElement.removeEventListener("pointerdown", onClick, false);
            renderer.current?.domElement.removeEventListener("mousemove", onDocumentMouseMove, false);
            // 场景中的参数释放清理或者置空等
            renderer.current.domElement.innerHTML = '';
            renderer.current.forceContextLoss();
            renderer.current.dispose();
            scene.current.clear();
            scene.current = undefined;
            camera.current = undefined;
            controls.current = undefined;
            renderer.current.domElement = undefined;
            renderer.current = undefined;

            console.log('clearScene');
        } else {
            console.log(dataValue)
            main(dataValue);
        }
    }

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.threeCharts} flex-box`}
            // @ts-ignore
            ref={dom}
            style={{ fontSize }}
        >
            <div id="instructions" className="flex-box">
                {
                    selectedBtn === 'scale' ?
                        <Input
                            style={{ maxWidth: 200 }}
                            placeholder="比例尺"
                            onBlur={(e) => {
                                const val = e.target.value;
                                localStorage.setItem("scale", val);
                            }}
                            defaultValue={localStorage.getItem("scale") || 1}
                        />
                        : null
                }
                <Tooltip title="比例尺">
                    <Button
                        icon={<FontSizeOutlined />}
                        type={selectedBtn === 'scale' ? 'primary' : 'default'}
                        className='btn'
                        onClick={() => setSelectedBtn((prev) => prev === 'scale' ? '' : 'scale')}
                    />
                </Tooltip>
                <Tooltip title="标注">
                    <Button
                        icon={<PlusOutlined />}
                        type={selectedBtn === 'bzBtn01' ? 'primary' : 'default'}
                        id="bzBtn01"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="显示边框">
                    <Button
                        icon={<BorderOuterOutlined />}
                        type={selectedBtn === 'bzBtn02' ? 'primary' : 'default'}
                        id="bzBtn02"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="显示坐标轴">
                    <Button
                        icon={<BorderlessTableOutlined />}
                        type={selectedBtn === 'bzBtn03' ? 'primary' : 'default'}
                        id="bzBtn03"
                        className='btn'
                    />
                </Tooltip>
                <Tooltip title="开启透视">
                    <Button
                        icon={<EyeOutlined />}
                        type={selectedBtn === 'bzBtn04' ? 'primary' : 'default'}
                        id="bzBtn04"
                        className='btn'
                    />
                </Tooltip>
                {/* <Button onClick={() => clearScene()}>clear</Button> */}
            </div>
            <div className="three-mask flex-box">加载中...</div>
            <canvas id="demoBox"></canvas>
        </div>
    );

};

export default ThreeCharts;