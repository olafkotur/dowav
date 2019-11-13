import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { IViewport, LocationData } from "../types";

type Lab3DProps = {
  viewport: IViewport;
  container: HTMLDivElement;
};

export default class Lab3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private cube: THREE.Mesh;
  private locationData: LocationData | null;
  private labModelLoaded: boolean;
  constructor(options: Lab3DProps) {
    this.scene = new THREE.Scene();
    this.locationData = null;
    this.camera = new THREE.PerspectiveCamera(
      75,
      options.viewport.width / options.viewport.height,
      0.1,
      1000
    );
    this.camera.position.set(-14, 10, -9);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, options.container);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(options.viewport.width, options.viewport.height);
    options.container.appendChild(this.renderer.domElement);
    this.labModelLoaded = false;

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

    // Create box
    this.cube = this.createBox();

    // Add 3d model
    let loader = new GLTFLoader();
    loader.load(
      `${process.env.PUBLIC_URL}/labmodel.glb`,
      gltf => {
        this.labModelLoaded = true;
        this.scene.add(gltf.scene);
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

  private createBox = () => {
    let geometry = new THREE.BoxGeometry(10.2, 2.5, 4.5333);
    let cubeMaterials = [
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.66,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.67,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.68,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        color: 0x2aa4d1,
        transparent: true,
        opacity: 0.69,
        side: THREE.DoubleSide
      })
    ];
    let cube = new THREE.Mesh(geometry, cubeMaterials);
    cube.position.set(-14, 10, -100);
    return cube;
  };

  public updateViewport = (viewport: IViewport) => {
    this.camera.aspect = viewport.width / viewport.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(viewport.width, viewport.height);
  };

  private highlightZone = () => {
    if (this.locationData) {
      this.cube.position.set(
        0,
        1.4,
        4.53 * (this.locationData.value - 1) - 4.53
      );
    }
  };

  public addLocationData = (data: LocationData) => {
    this.locationData = data;
    this.highlightZone();
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    if (this.labModelLoaded) {
      this.scene.remove(this.cube);
      this.scene.add(this.cube);
    }
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  };
}
