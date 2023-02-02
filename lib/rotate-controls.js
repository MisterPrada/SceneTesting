export default function rotateControls({ renderer, object3d }) {

    // Pointer state
    let pointerDown = false,
        pointerX = 0,
        pointerY = 0;

    // Area
    const canvas = renderer.domElement

    // Handlers
    canvas.addEventListener('touchmove', function (e) {
        if (!pointerDown) return;
        // console.log('event', e)
        var deltaX = e.targetTouches[0].clientX - pointerX,
            deltaY = e.targetTouches[0].clientY - pointerY;
        pointerX = e.targetTouches[0].clientX;
        pointerY = e.targetTouches[0].clientY;

        object3d.rotation.y += deltaX * 0.02
    }, false);

    canvas.addEventListener('touchstart', function (evt) {
        // evt.preventDefault();
        pointerDown = true;
        pointerX = evt.targetTouches[0].clientX;
        pointerY = evt.targetTouches[0].clientY;
    }, false);

    canvas.addEventListener('touchend', function (evt) {
        // evt.preventDefault();
        pointerDown = false;
    }, false);

}