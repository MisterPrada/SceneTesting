const ANIMATION_DURATION = 500;

export default class TransformAnimator {
    constructor({ logo, model, TWEEN }) {
        if (!logo || !model || !TWEEN) return;

        this.logo = logo;
        this.model = model;

        this.TWEEN = TWEEN;

        this.modelInitialPosition = model.position.clone();
        this.modelRaisedPoistion = model.position.clone();
        this.modelRaisedPoistion.y += 1.5;

        // console.log('positions', this.modelInitialPosition, this.modelRaisedPoistion);

        this.tweenShowLogo = new this.TWEEN.Tween(this.logo.material)
            .to({ opacity: 1 }, ANIMATION_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out)
        // .onUpdate(() => {
        //     this.logo.material.needsUpdate = true;
        // });

        this.tweenHideLogo = new this.TWEEN.Tween(this.logo.material)
            .to({ opacity: 0 }, ANIMATION_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out)
        // .onUpdate(() => {
        //     this.logo.material.needsUpdate = true;
        // });

        this.tweenRaiseModel = new this.TWEEN.Tween(this.model.position)
            .to(this.modelRaisedPoistion, ANIMATION_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out)

        this.tweenPlaceModel = new this.TWEEN.Tween(this.model.position)
            .to(this.modelInitialPosition, ANIMATION_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out)
    }

    play() {
        this.tweenShowLogo.start();
        this.tweenRaiseModel.start();
    }

    playBackward() {
        this.tweenHideLogo.start();
        this.tweenPlaceModel.start();
    }
}