import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const loader = new GLTFLoader();
const DracoLoader = new DRACOLoader();
DracoLoader.setDecoderPath( '/node_modules/three/examples/js/libs/draco/' );
//DracoLoader.preload();

loader.setDRACOLoader( DracoLoader );


document.addEventListener('DOMContentLoaded', () => {
    resizeDependent();
});

window.addEventListener('resize', () => {
    resizeDependent();
});

function resizeDependent() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const group = new THREE.Group();
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 4, 5);


// controls
let controls = new OrbitControls( camera, renderer.domElement );

// grid
const helper = new THREE.GridHelper( 10, 10 );
scene.add(helper);

// light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


let directionalLight = new THREE.DirectionalLight( 0xffffff, 20 );
directionalLight.target = group;
directionalLight.position.set(10, 10, 5);
let DirectionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 1 );
scene.add( DirectionalLightHelper );
scene.add( directionalLight );


const loadBase = () => {
    return new Promise((resolve, reject) => {
        loader.load('assets/models/car.glb',
            function (gltf) {
                let model = gltf.scene;

                model.traverse((node) => {
                    if(node.name.startsWith('style_')){
                        node.visible = false;
                    }

                    if(node.isMesh){
                        node.material.opacity = 0.5;
                        node.material.transparent = true;
                        node.material.needsUpdate = true;
                    }

                });

                group.add(model);
                resolve();
            },
            undefined,
            () => { reject(); });
    });
};


Promise.all([loadBase()]).then(() => {
    scene.add(group);
    camera.lookAt(group.position);
});


document.body.appendChild(renderer.domElement);

function animate() {

    // Ask the browser to call this function again next frame
    requestAnimationFrame(animate);


    renderer.render(scene, camera);
}

animate();
