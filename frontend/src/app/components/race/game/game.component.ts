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

    activeCarNumber; // 1 or 2

    activeFinished = false;

    renderScale: number = .9;

    constructor() { }

    ngOnInit() {

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(
            window.innerWidth * this.renderScale,
            window.innerHeight * this.renderScale);
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

            this.activeCarSetup();
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

            if (this.car1 && this.car2) {
                this.reportPosition();

                if (this.activeCarNumber == 1) {
                    this.car1.position.z -= this.car1Speed;
                    if (this.car1.position.z < -trackLength * trackRepeat + 6) {
                        this.car1Speed = 0;
                        this.reportFinish();
                    }
                    this.car1Speed -= .005;
                    if (this.car1Speed < 0)
                        this.car1Speed = 0;

                    this.car2.position.z = this.getOpponentPosition();
                } else if (this.activeCarNumber == 2) {
                    this.car2.position.z -= this.car2Speed;
                    if (this.car2.position.z < -trackLength * trackRepeat + 6) {
                        this.car2Speed = 0;
                        this.reportFinish();
                    }
                    this.car2Speed -= .005;
                    if (this.car2Speed < 0)
                    this.car2Speed = 0;
                    
                    this.car1.position.z = this.getOpponentPosition();
                }

                // camera part
                if (this.activeCar)
                    camera.position.z += (this.activeCar.position.z + 10 - camera.position.z) / 10;

            }
        }
        animate();

        let car1Lock = false;
        let car2Lock = false;

        const onDocumentKeyDown = (event) => {
            var keyCode = event.which;
            if (!this.car1 && !this.car2)
                return;

            if (keyCode == 32) {
                if (this.activeCarNumber == 1 && !car1Lock) {
                    this.car1Speed += .1;
                    car1Lock = true;
                } else if (this.activeCarNumber == 2 && !car2Lock) {
                    this.car2Speed += .1;
                    car2Lock = true;
                }
            }

            // if (keyCode == 90 && !car2Lock) {
            //     this.car2Speed += .1;
            //     car2Lock = true;
            // }

            // if (keyCode == 81) {
            //     this.activeCar = this.car1;
            // }

            // if (keyCode == 87) {
            //     this.activeCar = this.car2;
            // }

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
        document.addEventListener("keydown", onDocumentKeyDown, false);


        const onDocumentKeyUp = (event) => {
            var keyCode = event.which;
            if (!this.car1 && !this.car2)
                return;

            if (keyCode == 32) {
                if (this.activeCarNumber == 1) {
                    car1Lock = false;
                } else if (this.activeCarNumber == 2) {
                    car2Lock = false;
                }
            }

            // if (keyCode == 90) {
            //     car2Lock = false;
            // }
        };
        document.addEventListener("keyup", onDocumentKeyUp, false);

        const onWindowResize = () => {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth * this.renderScale,
                window.innerHeight * this.renderScale);
        }
        window.addEventListener('resize', onWindowResize, false);
    }
    reportPosition() {
        this.getActiveCarPosition(); // TODO: send to socket
    }
    activeCarSetup() {
        this.setActiveCar(1); // TODO: get responce
    }

    getOpponentPosition(): number {
        return -50;
    }

    setActiveCar(no: number): void {
        if (this.car1 && this.car2) {
            if (no == 1) {
                this.activeCar = this.car1;
                this.activeCarNumber = 1;
            } else if (no == 2) {
                this.activeCar = this.car2;
                this.activeCarNumber = 2;
            }
        }
    }

    getActiveCarPosition(): number {
        if (this.activeCarNumber == 1 && this.car1) {
            return this.car1.position.z;
        } else if (this.activeCarNumber == 2 && this.car2) {
            return this.car2.position.z;
        } else {
            return null;
        }
    }

    reportFinish() {
        if (!this.activeFinished) {
            console.log('i have finished');
            this.activeFinished = true;
        }
    }

}
