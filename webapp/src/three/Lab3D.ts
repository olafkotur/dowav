import * as THREE from 'three';
import { IViewport } from '../types';

type Lab3DProps = {
    viewport: IViewport;
    container: HTMLDivElement;
};

export default class Lab3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    constructor(options: Lab3DProps) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            options.viewport.width / options.viewport.height,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(options.viewport.width, options.viewport.height);
        options.container.appendChild(this.renderer.domElement);

        // DELETE
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.camera.position.z = 5;

        requestAnimationFrame(this.animate);
        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };
}
