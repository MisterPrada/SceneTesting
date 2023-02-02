import * as THREE from "three";

export function detector(renderer) {
    let targetElement = renderer.domElement;

    let emitGestureEvent = function (e) {
        const n = getTouchState(e), t = internalState.previousState,
            r = t && n && n.touchCount == t.touchCount, i = t && !r, o = n && !r;
        if (i) {
            const e = getEventPrefix(t.touchCount) + "fingerend";
            targetElement.dispatchEvent(new CustomEvent(e, { detail: t })), internalState.previousState = null
        }
        if (o) {
            n.startTime = performance.now(), n.startPosition = n.position, n.startSpread = n.spread;
            const e = getEventPrefix(n.touchCount) + "fingerstart";

            targetElement.dispatchEvent(new CustomEvent(e, { detail: n })), internalState.previousState = n
        }
        if (r) {
            const e = {
                positionChange: {
                    x: n.position.x - t.position.x,
                    y: n.position.y - t.position.y
                }
            };
            n.spread && (e.spreadChange = n.spread - t.spread), Object.assign(t, n), Object.assign(e, t);
            const r = getEventPrefix(n.touchCount) + "fingermove";

            targetElement.dispatchEvent(new CustomEvent(r, { detail: e }))
        }
    };


    let getTouchState = function (e) {
        if (0 == e.touches.length) return null;
        const n = [];
        for (let t = 0; t < e.touches.length; t++) n.push(e.touches[t]);
        const t = { touchCount: n.length }, r = n.reduce((e, n) => e + n.clientX, 0) / n.length,
            i = n.reduce((e, n) => e + n.clientY, 0) / n.length;
        t.positionRaw = { x: r, y: i };
        const o = 2 / (window.innerWidth + window.innerHeight);
        if (t.position = { x: r * o, y: i * o }, n.length >= 2) {
            const e = n.reduce((e, n) => e + Math.sqrt(Math.pow(r - n.clientX, 2) + Math.pow(i - n.clientY, 2)), 0) / n.length;
            t.spread = e * o
        }
        return t
    };

    let getEventPrefix = function (e) {
        return ["one", "two", "three", "many"][Math.min(e, 4) - 1];
    };


    let internalState = { previousState: null };

    targetElement.addEventListener("touchstart", emitGestureEvent);
    targetElement.addEventListener("touchend", emitGestureEvent);
    targetElement.addEventListener("touchmove", emitGestureEvent);
}

export function rotateModel(renderer, object3d, event) {
    let targetElement = renderer.domElement;

    let handleEvent = function (e) {
        object3d.rotation.y += 6 * e.detail.positionChange.x;
    };

    targetElement.addEventListener(event, handleEvent);
}

export class ScaleMoveControls {
    constructor({ renderer, object3d, trackerGroup, config, onPlacing, onRaising }) {

        this.object3d = object3d
        this.trackerGroup = trackerGroup
        this.config = config
        this.onPlacing = onPlacing
        this.onRaising = onRaising

        this.touches = 0;

        const START_POSITION = new THREE.Vector3(1, 0, -5);

        this.targetElement = renderer.domElement;
        this.initialScale = object3d.scale.clone();
        this.initialPosition = object3d.position.clone();

        this.scaleFactor = 1;

        this.isChanging = false;
        this.position = START_POSITION;

        this.isChanging = false;

        this.targetElement.addEventListener("twofingermove", (e) => this.handleEvent(e));

        this.targetElement.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                this.touches = e.touches.length;

                this.isChanging = true;
                this.onRaising()
                //DEBUG
                // debugElement.innerText = `${isChanging} +++ ${object3d.position.x} -- ${object3d.position.y} -- ${object3d.position.z}`
            }
        });

        this.targetElement.addEventListener('touchend', (e) => {
            if (e.touches.length < 2 || !e.touches.length) {
                if (this.touches >= 2) {
                    this.onPlacing()
                }
                this.touches = e.touches.length;
                this.isChanging = false;
                //DEBUG
                // debugElement.innerText = `${isChanging} +++ ${object3d.position.x} -- ${object3d.position.y} -- ${object3d.position.z}`
            }
        });
    }

    update() {
        if (this.isChanging) {
            this.trackerGroup.setAnchorPoseFromCameraOffset(this.position.x, this.position.y, this.position.z);
        }
    }

    reset() {
        this.scaleFactor = 1;
        this.object3d.scale.x = this.initialScale.x;
        this.object3d.scale.y = this.initialScale.y;
        this.object3d.scale.z = this.initialScale.z;

        this.object3d.position.copy(this.initialPosition);

        this.trackerGroup.setAnchorPoseFromCameraOffset(1, 0, -5);
    }

    handleEvent(e) {
        if (!e) {
            this.object3d.scale.x = this.initialScale.x;
            this.object3d.scale.y = this.initialScale.y;
            this.object3d.scale.z = this.initialScale.z;
            return;
        }

        // Ресайз
        this.scaleFactor *= 1 + e.detail.spreadChange / e.detail.startSpread;
        this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.config.min), this.config.max);
        this.object3d.scale.x = this.scaleFactor * this.initialScale.x;
        this.object3d.scale.y = this.scaleFactor * this.initialScale.y;
        this.object3d.scale.z = this.scaleFactor * this.initialScale.z;

        // Перемещение
        this.object3d.position.z += e.detail.positionChange.y * 20;
        this.object3d.position.x += e.detail.positionChange.x * 15;

        // Ограничения перемещения по оси x
        this.object3d.position.x = this.object3d.position.x > 1.5 ? 1.5 : this.object3d.position.x;
        this.object3d.position.x = this.object3d.position.x < -1.5 ? -1.5 : this.object3d.position.x;

        // Ограничения перемещения по оси z
        this.object3d.position.z = this.object3d.position.z > 1 ? 1 : this.object3d.position.z
        this.object3d.position.z = this.object3d.position.z < -10 ? -10 : this.object3d.position.z
    }
}

// Старая реализация перемещения модели

// export function moveModel(renderer, object3d, config) {
//     let targetElement = renderer.domElement;

//     let handleEvent = function (e) {

//      object3d.position.z += e.detail.positionChange.y * 15;
//      object3d.position.x += e.detail.positionChange.x * 15;
//      console.log(e.detail.positionChange.y * 10, object3d.position.x);

//     };

//     targetElement.addEventListener("twofingermove", handleEvent);
// }
