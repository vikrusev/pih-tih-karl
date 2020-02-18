import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.scss']
})
export class GarageComponent implements OnInit, OnDestroy {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  loader = new GLTFLoader();

  renderScale = .4;

  resizeCallback = this.setUpScale.bind(this);

  properties = [
    { name: "acceleration", value: 10 },
    { name: "stability", value: 10 },
    { name: "max-speed", value: 10 }
  ];

  car: THREE.Scene;

  @ViewChild("car3d") car3d: ElementRef;

  constructor() { }

  ngOnInit() {
    this.setUpScene();
    this.loadCar();

    this.animate();

    window.addEventListener('resize', this.resizeCallback, false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
    this.rotateCar();

  }

  rotateCar() {
    const smoother = (x: number) => {
      return x + (1 - x) / 2;
    };

    const sinCos = (x: number, scale = .0025) => {
      return Math.max(Math.abs(Math.cos(x * scale)), Math.abs(Math.sin(x * scale)));
    }

    const motion = () => {
      return smoother(sinCos((new Date()).getTime()));
    }

    if (this.car) {
      this.car.rotation.y += .02;
      this.car.scale.x = motion();
      this.car.scale.y = motion();
      this.car.scale.z = motion();
    }
  }

  loadCar() {
    this.loader.load(`${environment.backendUrl}/static_files/glb/car_centered.glb`, (gltf) => {
      this.car = gltf.scene;

      this.scene.add(this.car);

    }, undefined, function (error) {
      console.error(error);
    });
  }

  setUpScene() {
    // this.renderer.setSize(
    //   window.innerWidth * this.renderScale,
    //   window.innerHeight * this.renderScale);
    this.setUpScale();

    this.renderer.setClearColor(0x555588, 1);

    this.car3d.nativeElement.appendChild(this.renderer.domElement);

    let lightHem = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
    lightHem.name = "lightHem";
    this.scene.add(lightHem);

    this.camera.position.set(0, 1, 4);
  }

  onIncrease(name) {
    let i = this.properties.findIndex(i => i.name === name);
    if (this.properties[i].value < 100) {
      this.properties[i].value += 10;
    }
  }

  onDecrease(name) {
    let i = this.properties.findIndex(i => i.name === name);
    if (this.properties[i].value > 10) {
      this.properties[i].value -= 10;
    }
  }

  setUpScale() {
    if (window.innerHeight < 768 || window.innerWidth < 768) {
      this.camera.aspect = window.innerWidth / window.innerHeight
        * (.9 / this.renderScale);

      this.renderer.setSize(
        window.innerWidth * .9,
        window.innerHeight * this.renderScale);
    } else {
      this.camera.aspect = window.innerWidth / window.innerHeight;

      this.renderer.setSize(
        window.innerWidth * this.renderScale,
        window.innerHeight * this.renderScale);
    }
    this.camera.updateProjectionMatrix();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize',  this.resizeCallback, false);
  }

}
