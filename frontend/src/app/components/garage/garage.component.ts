import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.scss']
})
export class GarageComponent implements OnInit {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  loader = new GLTFLoader();

  renderScale = .4;

  car: THREE.Scene;

  @ViewChild("car3d") car3d: ElementRef;

  constructor() { }

  ngOnInit() {
    this.setUpScene();
    this.loadCar();

    this.animate();

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

    const motion= () => {
      return smoother (sinCos((new Date()).getTime()));
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
    this.renderer.setSize(
      window.innerWidth * this.renderScale,
      window.innerHeight * this.renderScale);

    this.renderer.setClearColor(0x555588, 1);

    this.car3d.nativeElement.appendChild(this.renderer.domElement);

    let lightHem = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
    lightHem.name = "lightHem";
    this.scene.add(lightHem);

    this.camera.position.set(0, 1, 4);
  }

}
