import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { IViewport } from '../types';

type Lab3DProps = {
    viewport: IViewport;
    container: HTMLDivElement;
};

export default class Lab3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    constructor(options: Lab3DProps) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            options.viewport.width / options.viewport.height,
            0.1,
            1000
        );
        this.controls = new OrbitControls(this.camera, options.container);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(options.viewport.width, options.viewport.height);
        options.container.appendChild(this.renderer.domElement);

        // Add a light
        const sun = new THREE.PointLight(0xffffff, 1.6, 0);
        sun.position.set(0, 50, 0);
        this.scene.add(sun);
        const lightRight = new THREE.PointLight(0xffffff, 0.6, 0);
        lightRight.position.set(-20, 12, -25);
        this.scene.add(lightRight);
        const lightLeft = new THREE.PointLight(0xffffff, 0.6, 0);
        lightLeft.position.set(18, 12, 18);
        this.scene.add(lightLeft);

        // Add 3d model
        let loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL}/labmodel.glb`,
            gltf => {
                this.scene.add(gltf.scene);
                this.camera.position.set(-14, 10, -9);
                this.camera.lookAt(0, 0, 0);
                this.controls.update();
            },
            xhr => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            error => {
                console.log("ERROR. Can't load the model");
                console.log(error);
            }
        );

        requestAnimationFrame(this.animate);
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    };
}
