
const ANIMATION_DURATION = 1500;
const ANIMATED_MATERIALS = {
    "Main": { color_to: { r: 0.083, g: 0.134, b: 0.025 } },                // 538619
    "black1_material": { color_to: { r: 0.083, g: 0.134, b: 0.025 } },     // 538619
    "black2_material": { color_to: { r: 0.083, g: 0.134, b: 0.025 } },     // 538619
    "grey1_material": { color_to: { r: 0.148, g: 0.150, b: 0.147 } },    // 949693 (opacity: 1)
    "grey2_material": { color_to: { r: 0.148, g: 0.150, b: 0.147 } },    // 949693
    "green_material": { color_to: { r: 0.002, g: 0.148, b: 0.149 } },      // 029495
    "yellow_material": { color_to: { r: 0.158, g: 0.134, b: 0.059 } },    // 9E863B
    "blue_material": { color_to: { r: 0.002, g: 0.148, b: 0.149 } },       // 029495
    "blue2_material": { color_to: { r: 0.002, g: 0.148, b: 0.149 } },      // 029495
    // "text1_material": { color_to: { r: 0.083, g: 0.134, b: 0.025, } },     // 538619
    // "text2_material": { color_to: { r: 0.083, g: 0.134, b: 0.025, } },     // 538619
}


export default class ColorAnimator {
    constructor({ model, TWEEN }) {

        this.materials = [];
        this.model = model;
        this.TWEEN = TWEEN;

        this.model.traverse(object => {
            if (
                object.material &&
                Object.prototype.hasOwnProperty.call(ANIMATED_MATERIALS, object.material.name)
            ) {
                // Collect materials
                ANIMATED_MATERIALS[object.material.name].material = object.material;
                // Collect start colors
                ANIMATED_MATERIALS[object.material.name].color_from = {
                    ...object.material.color
                };
            }
        });
        this.createAnimations();
    }

    play() {
        for (const key in ANIMATED_MATERIALS) {
            if (Object.hasOwnProperty.call(ANIMATED_MATERIALS, key)) {
                const obj = ANIMATED_MATERIALS[key];
                obj.tweenForward.start();
            }
        }
    }

    playBackward() {
        for (const key in ANIMATED_MATERIALS) {
            if (Object.hasOwnProperty.call(ANIMATED_MATERIALS, key)) {
                const obj = ANIMATED_MATERIALS[key];
                obj.tweenBackward.start();
            }
        }
    }

    reset() {
        for (const key in ANIMATED_MATERIALS) {
            if (Object.hasOwnProperty.call(ANIMATED_MATERIALS, key)) {
                const obj = ANIMATED_MATERIALS[key];
                obj.material.color = { ...obj.color_from }
            }
        }
        this.createAnimations();
    }

    createAnimations() {
        for (const key in ANIMATED_MATERIALS) {
            if (Object.hasOwnProperty.call(ANIMATED_MATERIALS, key)) {

                const obj = ANIMATED_MATERIALS[key];

                obj.tweenForward = new this.TWEEN.Tween(obj.material.color)
                    .to({ ...obj.color_to }, ANIMATION_DURATION)
                    .onUpdate(() => {
                        // console.log(obj.material.color);
                        obj.material.needsUpdate = true;
                    });

                obj.tweenBackward = new this.TWEEN.Tween(obj.material.color)
                    .to({ ...obj.color_from }, ANIMATION_DURATION)
                    .onUpdate(() => {
                        // console.log(obj.material.color);
                        obj.material.needsUpdate = true;
                    });
                // console.log('--', obj.material.name, obj.material.color, obj.color_to);
            }
        }
    }
}