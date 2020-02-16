import { OnInit, ElementRef, ViewChild } from '@angular/core';

import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import { environment } from '../../../../environments/environment'

import { Light } from 'three';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

interface Car {
    car: THREE.Scene,
    finished: boolean,
    lock?: boolean,
    speed?: number
}

export class GameCanvas {

    // report statuses
    reporter$: Subject<GameReport> = new BehaviorSubject<GameReport>(null);

    // determine which car is controlled
    activeCar: Boolean = false; // false is 'left' car, 'true' is right car

    // both cars
    myCar: Car = {
        car: null,
        speed: 0,
        lock: false,
        finished: false
    }

    opponentCar: Car = {
        car: null,
        finished: false
    }

    // scene settings
    renderScale: number = .9;
    scene: THREE.Scene = new THREE.Scene();
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    loader: GLTFLoader = new GLTFLoader();
    lights: Light[] = [];

    // DOM element to append the canvas
    game3d: ElementRef = null;

    // track settings
    readonly trackLength: number = 200;
    readonly trackRepeat: number = 5;

    // path to 3d models
    readonly glbPath: string = `${environment.backendUrl}/static_files/glb`;

    constructor(canvas: ElementRef, activeCar: Boolean) {
        this.game3d = canvas;
        this.activeCar = activeCar;

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
    }

    appendRenderer(element: ElementRef): void {
        // TO-DO: width should be the component's width
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
        this.loader.load(`${this.glbPath}/car.glb`, async (gltf: GLTF) => {
            let leftCar: THREE.Scene = gltf.scene;
            leftCar.rotation.y -= Math.PI / 2;

            let rightCar: THREE.Scene = leftCar.clone();
            rightCar.position.x -= 7.3;

            [this.myCar.car, this.opponentCar.car] = this.activeCar ? [rightCar, leftCar] : [leftCar, rightCar];

            console.log(this.activeCar)

            this.scene.add(this.myCar.car);
            this.scene.add(this.opponentCar.car);

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

        if (this.myCar.car && this.opponentCar.car) {
            this.reportPosition();

            if (this.myCar.car.position.z < -this.trackLength * this.trackRepeat + 6) {
                this.myCar.speed = 0;
                this.reportFinish();
            }

            this.myCar.speed -= .005;
            if (this.myCar.speed < 0)
                this.myCar.speed = 0;

            this.myCar.car.position.z -= this.myCar.speed;

            // camera part
            if (this.myCar) {
                this.camera.position.z += (this.myCar.car.position.z + 10 - this.camera.position.z) / 10;
            }

        }
    }

    onDocumentKeyDown(event: KeyboardEvent): void {
        var keyCode = event.which;
        if (!this.myCar && !this.opponentCar) {
            return;
        }

        if (keyCode == 32) {
            this.myCar.speed += .1;
            this.myCar.lock = true;
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
        if (!this.myCar.car && !this.opponentCar.car) {
            return;
        }

        if (keyCode == 32) {
            this.myCar.lock = false;
        }
    };

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            window.innerWidth * this.renderScale,
            window.innerHeight * this.renderScale);
    }

    getReporter(): Subject<GameReport> {
        return this.reporter$;
    }

    reportPosition() {
        this.reporter$.next({ emitEvent: 'report-own-position', data: this.myCar.car.position.z });
    }

    reportFinish() {
        if (!this.myCar.finished) {
            console.log('i have finished');
            this.myCar.finished = true;

            this.reporter$.next({ emitEvent: 'report-own-finish', data: this.myCar.car.position.z });
        }
    }

    setOpponentPosition(position: number): void {
        this.opponentCar.car.position.z = position;
    }

}