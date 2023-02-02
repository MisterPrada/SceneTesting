import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function loadGLTF(path, manager) {
    return new Promise((resolve, reject) => {
        new GLTFLoader(manager)
            .load(path,
                gltf => {
                    gltf.scene.traverse(child => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    resolve(gltf);
                },
                progress => { console.log('Loading progress...', progress) },
                error => { reject(); console.error('loadGLTF()', error); }
            );
    });
}

function loadHDR(path, renderer, scene, manager) {
    return new Promise((resolve, reject) => {
        const loader = new RGBELoader(manager);
        loader.setDataType(THREE.UnsignedByteType);

        loader
            .load(
                path,
                texture => {

                    // PMREM GENERATOR
                    const pmremGenerator = new THREE.PMREMGenerator(renderer);
                    pmremGenerator.compileEquirectangularShader();

                    // const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    // this.scene.background = envMap;
                    scene.environment = pmremGenerator.fromEquirectangular(texture).texture;

                    texture.dispose();
                    pmremGenerator.dispose();

                    resolve(texture);
                },
                // called while loading is progressing
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% HDR loaded');
                },
                // called when loading has errors
                function (error) {
                    console.log('loadHDR()', error);
                    reject(error);
                });
    });
}

export {
    loadGLTF,
    loadHDR
}