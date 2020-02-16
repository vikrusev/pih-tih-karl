import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { environment } from '../../../../environments/environment'

import { Light } from 'three';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    car1: THREE.Scene = null;
    car2: THREE.Scene = null;
    car1Speed: number = 0;
    car2Speed: number = 0;

    activeCar: THREE.Scene = null;
    activeCarNumber: number = null; // 1 or 2
    activeFinished: boolean = false;
    renderScale: number = .9;

    scene: THREE.Scene = new THREE.Scene();
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    loader: GLTFLoader = new GLTFLoader();

    lights: Light[] = [];

    readonly trackLength: number = 200;
    readonly trackRepeat: number = 5;

    car1Lock: boolean = false;
    car2Lock: boolean = false;

    readonly glbPath: string = `${environment.backendUrl}/static_files/glb`;

    @ViewChild('game3d') game3d: ElementRef = null;

    constructor() { }

    ngOnInit() {
        // set camera position
        this.camera.position.set(0, 5, 6);

        // apend renderer
        this.appendRenderer(this.game3d);

        // add lights
        this.lights = this.initLights();
        this.scene.add(this.lights[0]);

        // prepare 3d models
        this.setModels();

        // start animation
        this.animate();

        // add event listeners
        document.addEventListener("keydown", (e: KeyboardEvent) => this.onDocumentKeyDown(e), false);
        document.addEventListener("keyup", (e: KeyboardEvent) => this.onDocumentKeyUp(e), false);

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    appendRenderer(element: ElementRef): void {
        this.renderer.setSize(
            window.innerWidth * this.renderScale,
            window.innerHeight * this.renderScale);

        this.renderer.setClearColor(0x999999, 1);

        element.nativeElement.appendChild(this.renderer.domElement);
    }

    initLights(): Light[] {
        let lightHom = new THREE.AmbientLight(0xffffff);
        lightHom.name = "lightHom";

        let lightHem = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
        lightHem.name = "lightHem";

        return [lightHem, lightHom];
    }

    setModels(): void {
        this.loader.load(`${this.glbPath}/car.glb`, (gltf: GLTF) => {
            this.car1 = gltf.scene;
            this.car1.rotation.y -= Math.PI / 2;

            this.car2 = this.car1.clone();
            this.car2.position.x -= 7.3;

            this.scene.add(this.car1);
            this.scene.add(this.car2);

            this.activeCarSetup();
        }, undefined, (error) => {
            console.error(error);
        });

        this.loader.load(`${this.glbPath}/track.glb`, (gltf: GLTF) => {
            let track = gltf.scene;
            track.rotation.y -= Math.PI / 2;

            this.scene.add(track);

            for (let i = 1; i < this.trackRepeat; i++) {
                let repeatedTrack = track.clone();
                repeatedTrack.position.z -= this.trackLength * i;

                this.scene.add(repeatedTrack);
            }

        }, undefined, (error) => {
            console.error(error);
        });

        this.loader.load(`${this.glbPath}/fence.glb`, (gltf: GLTF) => {
            let fenceRight = gltf.scene;
            fenceRight.rotation.y -= Math.PI / 2;

            let fenceLeft = fenceRight.clone();

            fenceLeft.position.x -= 15.5;

            this.scene.add(fenceLeft);
            this.scene.add(fenceRight);

            for (let i = 1; i < this.trackRepeat; i++) {
                let repeatedFenceLeft = fenceLeft.clone();
                let repeatedFenceRight = fenceRight.clone();

                repeatedFenceLeft.position.z -= this.trackLength * i;
                repeatedFenceRight.position.z -= this.trackLength * i;

                this.scene.add(repeatedFenceLeft);
                this.scene.add(repeatedFenceRight);
            }
        }, undefined, (error) => {
            console.error(error);
        });

        this.loader.load(`${this.glbPath}/fence_short.glb`, (gltf: GLTF) => {
            let fenceMiddle = gltf.scene;
            fenceMiddle.rotation.y -= Math.PI / 2;

            this.scene.add(fenceMiddle);
            for (let i = 1; i < this.trackRepeat; i++) {
                let repeatedFenceMiddle = fenceMiddle.clone();
                repeatedFenceMiddle.position.z -= this.trackLength * i;

                this.scene.add(repeatedFenceMiddle);
            }
        }, undefined, (error) => {
            console.error(error);
        });
    }

    animate() {
        // initiate new frame
        requestAnimationFrame(() => this.animate());

        this.renderer.render(this.scene, this.camera);

        if (this.car1 && this.car2) {
            this.reportPosition();

            if (this.activeCarNumber == 1) {
                this.car1.position.z -= this.car1Speed;
                if (this.car1.position.z < -this.trackLength * this.trackRepeat + 6) {
                    this.car1Speed = 0;
                    this.reportFinish();
                }
                this.car1Speed -= .005;
                if (this.car1Speed < 0)
                    this.car1Speed = 0;

                this.car2.position.z = this.getOpponentPosition();
            } else if (this.activeCarNumber == 2) {
                this.car2.position.z -= this.car2Speed;
                if (this.car2.position.z < -this.trackLength * this.trackRepeat + 6) {
                    this.car2Speed = 0;
                    this.reportFinish();
                }
                this.car2Speed -= .005;
                if (this.car2Speed < 0)
                    this.car2Speed = 0;

                this.car1.position.z = this.getOpponentPosition();
            }

            // camera part
            if (this.activeCar) {
                this.camera.position.z += (this.activeCar.position.z + 10 - this.camera.position.z) / 10;
            }

        }
    }

    onDocumentKeyDown(event: KeyboardEvent): void {
        var keyCode = event.which;
        if (!this.car1 && !this.car2)
            return;

        if (keyCode == 32) {
            if (this.activeCarNumber == 1 && !this.car1Lock) {
                this.car1Speed += .1;
                this.car1Lock = true;
            } else if (this.activeCarNumber == 2 && !this.car2Lock) {
                this.car2Speed += .1;
                this.car2Lock = true;
            }
        }

        if (keyCode == 49) {
            let selectedObject = this.scene.getObjectByName("lightHom");
            if (selectedObject)
                this.scene.remove(selectedObject);

            let checkObject = this.scene.getObjectByName("lightHem");
            if (!checkObject)
                this.scene.add(this.lights[0]);
        }

        if (keyCode == 50) {
            let selectedObject = this.scene.getObjectByName("lightHem");
            if (selectedObject)
                this.scene.remove(selectedObject);

            let checkObject = this.scene.getObjectByName("lightHom");
            if (!checkObject)
                this.scene.add(this.lights[1]);
        }
    };

    onDocumentKeyUp(event: KeyboardEvent): void {
        const keyCode = event.which;
        if (!this.car1 && !this.car2)
            return;

        if (keyCode == 32) {
            if (this.activeCarNumber == 1) {
                this.car1Lock = false;
            } else if (this.activeCarNumber == 2) {
                this.car2Lock = false;
            }
        }
    };

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            window.innerWidth * this.renderScale,
            window.innerHeight * this.renderScale);
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
