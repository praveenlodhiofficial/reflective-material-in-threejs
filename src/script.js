import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


/**
 * GUI
 */
const gui = new GUI();    // to initiate the controller on the Canvas

const options = {
    environment: 'City Night', // Default environment map
};


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// ----------------------> LOADING MATCAPS
const matcap = textureLoader.load("/textures/matcaps/2.png"); // Load matcap texture
matcap.colorSpace = THREE.SRGBColorSpace; // Set the color space to SRGB

// ----------------------> LOADING GRADIENT
const gradient = textureLoader.load("/textures/gradients/3.jpg"); // Load gradient texture
gradient.magFilter = THREE.NearestFilter; // Set magnification filter to nearest
gradient.minFilter = THREE.NearestFilter; // Set minification filter to nearest
gradient.generateMipmaps = false; // Disable mipmaps generation

// ----------------------> ENVIROMENT MAP OPTIONS
const envMaps = {
    "City Center": "/textures/environmentMap/2k.hdr",
    "Closed Room": "/textures/environmentMap/3k.hdr",
    "Suburbs": "/textures/environmentMap/4k.hdr",
    "City Night": "/textures/environmentMap/5k.hdr",
    "Forest": "/textures/environmentMap/6k.hdr",
};

// ----------------------> RGBE LOADER & LOADING ENVIROMENT MAPS
const rgbeLoader = new RGBELoader(); // Used to load the environment map
const loadEnvironmentMap = (path) => {
    rgbeLoader.load(path, (environmentMap) => {
        // console.log(enviromentMap);  // Check if the environment map loads properly
        environmentMap.mapping = THREE.EquirectangularReflectionMapping; // it make a one enviroment including model or object and the background to rotate as one in enviroment
        scene.background = environmentMap; // Set the environment map as the scene background
        scene.environment = environmentMap; // Optionally set it as the scene environment
    });
};

// Initial environment map
loadEnvironmentMap(envMaps[options.environment]);
















/**
 * object/Material 
 */

// ----------------------> ADDING MATERIAL & TEXTURE TO IT

// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture; 

// ----------------------> ADDING COLOR TO MATERIAL

// material.color = new THREE.Color("#ff00ff"); // Set the material color to magenta
// material.wireframe = true; // Render the material as a wireframe
// material.transparent = true; // Enable transparency for the material
// material.opacity = 0.5; // Set the material's opacity to 50%

// ----------------------> ALPHA MAPPING

// material.transparent = true; // Enable transparency for the material
// material.alphaMap = doorAlphaTexture; // Apply an alpha map texture to control the transparency also it does not put only the texture given on object and unnecessary part cutout. 
// material.side = THREE.DoubleSide; // Render both sides of the material (front and back faces)

// ----------------------> MESH NORMAL MATERIAL 

// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true; // Render the material as a wireframe
// material.flatShading = true; // Render the material as a flat shading

// ----------------------> MATCAPS 

// material.matcap = matcap; // Apply a matcap texture to control the appearance of the material
// material.side = THREE.DoubleSide;

// ----------------------> LAMBERT MATERIAL

// const material = new THREE.MeshLambertMaterial();  // Performance oriented required light source
// const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 30);  // default place in center of material or canvas
// scene.add(pointLight); 

// ----------------------> TOON MATERIAL

// const material = new THREE.MeshToonMaterial(); // It give cartoonish Effect
// material.gradientMap = gradient;
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 5);  // default place in center of material or canvas
// scene.add(pointLight); 

// ---------------------->STANDARD MATERIAL

const material = new THREE.MeshStandardMaterial(); // It give cartoonish Effect
material.side = THREE.DoubleSide; // Render both sides of the material (front and back faces)
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
// scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 5);  // default place in center of material or canvas
pointLight.intensity = 0.05;
pointLight.color.set(0xFFD700); // Set the light color to gold



scene.add(pointLight);
material.metalness = 0.5;
material.roughness = 0.18;
material.map = doorColorTexture;
material.transparent = true; // Enable transparency for the material
material.aoMap = doorAmbientOcclusionTexture; //to make object little dark not faded
material.alphaMap = doorAlphaTexture; // Apply an alpha map texture to control the transparency also it does not put only the texture given on object and unnecessary part cutout. 

// material.displacementMap = doorHeightTexture;     //used to bulge out surface of objects to look more real but it more loading so instesd to this we can use  normal  texture (line 151)
// material.displacementScale = 0.15;

material.normalMap = doorNormalTexture; //used to bulge out surface of objects to look more real act as a substitute of displacement map.
material.normalScale.x = 0.9;
material.normalScale.y = 0.9;

// GUI Controls Settings
gui.add(material, "roughness").min(0).max(1);
gui.add(material, "metalness").min(0).max(1);
gui.add(options, 'environment', Object.keys(envMaps)).onChange((value) => {
    loadEnvironmentMap(envMaps[value]);
});


// Adding Objects in Canvas

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), material);
plane.position.x = 1.4;
scene.add(plane);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 20), material);
sphere.position.x = -1.4;
scene.add(sphere);

const torus = new THREE.Mesh(new THREE.TorusGeometry(1.4, 1, 16, 32), material);
torus.position.z = -10;
scene.add(torus);




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = -0.5
camera.position.z = 2.9
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    plane.rotation.x = elapsedTime * 0.4;
    plane.rotation.y = elapsedTime * 0.4;
    sphere.rotation.x = elapsedTime * 0.6;
    sphere.rotation.y = elapsedTime * 0.3;
    torus.rotation.x = elapsedTime * 0.4;
    torus.rotation.y = elapsedTime * 0.8;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()