import * as THREE from "three";

export default class DragControls {

    constructor({ camera, renderer, object3d, ground, dragDelay, riseHeight }) {
        this.camera = camera;
        this.threeCamera = camera; // 3D camera
        this.ground = ground;

        this.canvas = renderer.domElement;
        this.object3d = object3d;

        this.data = {
            dragDelay,
            riseHeight
        };

        this.internalState = {
            fingerDown: !1,
            dragging: !1,
            distance: 0,
            startDragTimeout: null,
            raycaster: new THREE.Raycaster
        };

        // Обработчики событий
        this.fingerDown = this.fingerDown.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.fingerMove = this.fingerMove.bind(this);
        this.fingerUp = this.fingerUp.bind(this);

        // Подписка на события
        this.canvas.addEventListener("mousedown", this.fingerDown);
        this.canvas.addEventListener("onefingermove", this.fingerMove);
        this.canvas.addEventListener("onefingerend", this.fingerUp);
    }

    tick() {
        if (this.internalState.dragging) {
            let e = null;
            if (this.internalState.positionRaw) {
                const n = this.internalState.positionRaw.x / document.body.clientWidth * 2 - 1
                    , t = this.internalState.positionRaw.y / document.body.clientHeight * 2 - 1
                    , r = new THREE.Vector2(n, -t);
                this.threeCamera = this.threeCamera || this.camera.getObject3D("camera"),
                    this.internalState.raycaster.setFromCamera(r, this.threeCamera);
                const i = this.internalState.raycaster.intersectObject(this.ground, !0);
                if (i.length > 0) {
                    const n = i[0];
                    this.internalState.distance = n.distance,
                        e = n.point
                }
            }
            e || (e = this.camera.localToWorld(new THREE.Vector3(0, 0, -this.internalState.distance))),
                e.y = this.data.riseHeight,
                this.object3d.position.lerp(e, .2)
        }
    }


    fingerDown(e) {
        this.internalState.fingerDown = !0,
            this.internalState.startDragTimeout = setTimeout(this.startDrag, this.data.dragDelay),
            this.internalState.positionRaw = e.detail.positionRaw
    };

    startDrag(e) {


        this.internalState.fingerDown && (this.internalState.dragging = !0,
            this.internalState.distance = this.object3d.position.distanceTo(this.camera.position))
    };

    fingerMove(e) {
        this.internalState.positionRaw = e.detail.positionRaw
    };


    fingerUp(e) {
        // Анимация позже

        // if (this.internalState.fingerDown = !1,
        //     clearTimeout(this.internalState.startDragTimeout),
        //     this.internalState.positionRaw = null,
        //     this.internalState.dragging) {

        // const e = this.el.object3D.position.clone();
        // this.el.setAttribute("animation__drop", {
        //     property: "position",
        //     to: `${e.x} 0 ${e.z}`,
        //     dur: 300,
        //     easing: "easeOutQuad"
        // })

        // }
        this.internalState.dragging = !1
    }


}