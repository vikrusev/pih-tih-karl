import { Component, OnInit } from '@angular/core';

// const THREE = require('three');
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    car1: THREE.Scene;
    car2: THREE.Scene;
    car1Speed: number = 0;
    car2Speed: number = 0;

    activeCar: THREE.Scene;

    constructor() { }

    ngOnInit() {

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x999999, 1);
        let test = document.querySelector('.game3d');
        console.log(test)
        test.appendChild(renderer.domElement);


        camera.position.set(0, 5, 6);

        let lightHom = new THREE.AmbientLight(0xffffff);
        lightHom.name = "lightHom";
        let lightHem = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
        lightHem.name = "lightHem";
        scene.add(lightHem);

        let loader = new GLTFLoader();


        const trackLength = 200;
        const trackRepeat = 5;

        loader.load(`${environment.backendUrl}/static/car.glb`, (gltf) => {
            this.car1 = gltf.scene;
            this.car1.rotation.y -= 3.14159 / 2;
            this.car2 = this.car1.clone();

            this.car2.position.x -= 7.3;

            scene.add(this.car1);
            scene.add(this.car2);

            this.activeCar = this.car2;
        }, undefined, function (error) {
            console.error(error);
        });

        loader.load(`${environment.backendUrl}/static/track.glb`, (gltf) => {
            let track = gltf.scene;
            track.rotation.y -= 3.14159 / 2;

            scene.add(track);
            for (let i = 1; i < trackRepeat; i++) {
                let repeatedTrack = track.clone();
                repeatedTrack.position.z -= trackLength * i;
                scene.add(repeatedTrack);
            }

        }, undefined, function (error) {
            console.error(error);
        });

        loader.load(`${environment.backendUrl}/static/fence.glb`, (gltf) => {
            let fenceRight = gltf.scene;
            fenceRight.rotation.y -= 3.14159 / 2;
            let fenceLeft = fenceRight.clone();

            fenceLeft.position.x -= 15.5;

            scene.add(fenceLeft);
            scene.add(fenceRight);
            for (let i = 1; i < trackRepeat; i++) {
                let repeatedFenceLeft = fenceLeft.clone();
                let repeatedFenceRight = fenceRight.clone();
                repeatedFenceLeft.position.z -= trackLength * i;
                repeatedFenceRight.position.z -= trackLength * i;
                scene.add(repeatedFenceLeft);
                scene.add(repeatedFenceRight);
            }
        }, undefined, function (error) {
            console.error(error);
        });

        loader.load(`${environment.backendUrl}/static/fence_short.glb`, (gltf) => {
            let fenceMiddle = gltf.scene;
            fenceMiddle.rotation.y -= 3.14159 / 2;
            scene.add(fenceMiddle);
            for (let i = 1; i < trackRepeat; i++) {
                let repeatedFenceMiddle = fenceMiddle.clone();
                repeatedFenceMiddle.position.z -= trackLength * i;
                scene.add(repeatedFenceMiddle);
            }
        }, undefined, function (error) {
            console.error(error);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            if (this.car1) {
                this.car1.position.z -= this.car1Speed;
                if (this.car1.position.z < -trackLength * trackRepeat + 6) {
                    this.car1Speed = 0;
                }

                this.car2.position.z -= this.car2Speed;
                if (this.car2.position.z < -trackLength * trackRepeat + 6) {
                    this.car2Speed = 0;
                }

                this.car1Speed -= .005;
                if (this.car1Speed < 0)
                    this.car1Speed = 0;

                this.car2Speed -= .005;
                if (this.car2Speed < 0)
                    this.car2Speed = 0;

                // camera part
                camera.position.z += (this.activeCar.position.z + 10 - camera.position.z) / 10;

            }
        }
        animate();

        let car1Lock = false;
        let car2Lock = false;
        document.addEventListener("keydown", onDocumentKeyDown, false);
        function onDocumentKeyDown(event) {
            var keyCode = event.which;
            if (!this.car1 && !this.car2)
                return;

            if (keyCode == 32 && !car1Lock) {
                this.car1Speed += .1;
                car1Lock = true;
            }

            if (keyCode == 90 && !car2Lock) {
                this.car2Speed += .1;
                car2Lock = true;
            }

            if (keyCode == 81) {
                this.activeCar = this.car1;
            }

            if (keyCode == 87) {
                this.activeCar = this.car2;
            }

            if (keyCode == 49) {
                let selectedObject = scene.getObjectByName("lightHem");
                console.log(selectedObject);
                if (selectedObject)
                    scene.remove(selectedObject);

                let checkObject = scene.getObjectByName("lightHom");
                if (!checkObject)
                    scene.add(lightHom);
            }

            if (keyCode == 50) {
                let selectedObject = scene.getObjectByName("lightHom");
                if (selectedObject)
                    scene.remove(selectedObject);

                let checkObject = scene.getObjectByName("lightHem");
                if (!checkObject)
                    scene.add(lightHem);
            }
        };
        document.addEventListener("keyup", onDocumentKeyUp, false);
        function onDocumentKeyUp(event) {
            var keyCode = event.which;
            if (!this.car1 && !this.car2)
                return;

            if (keyCode == 32) {
                car1Lock = false;
            }

            if (keyCode == 90) {
                car2Lock = false;
            }
        };

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

}
