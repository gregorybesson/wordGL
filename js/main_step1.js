//COLORS
var Colors = {
    red:0xf25346,
    white:0xffffff,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x0000ff,
};

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

var fieldDistance;
var energyBar;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xdddddd, 100,950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0x000000,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}


var AirPlane = function(){
	this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Create the cabin
	var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Create Engine
  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
	this.mesh.add(engine);

  // Create Tailplane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

  // Create Wing

  var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,0,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

  // Propeller

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades

  var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8,0,0);
  blade.castShadow = true;
  blade.receiveShadow = true;
	this.propeller.add(blade);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);
};

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    //c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.SphereGeometry(20,5,5);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
    opacity:.8,
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

Text = function(font, str){
  var cubeMat = new THREE.MeshLambertMaterial({color: 0xff3300})
  var textGeo = new THREE.TextGeometry( str, {
      font: font,
      size: 40,
      height: 3,
      curveSegments: 2
    });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  this.mesh = new THREE.Mesh(textGeo, cubeMat)
  this.mesh.scale.set(.25,.25,.25);
  this.mesh.castShadow = true;
}

// 3D Models
var airplane;
var text;
var textok;
var textnok;
var energy = 100;

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}


function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function updateDistance(){
  fieldDistance.innerHTML = parseInt(fieldDistance.innerText) + 1;
}

function updateEnergy(){
  energy -= parseInt(fieldDistance.innerText)/2000;
  energy = Math.max(0, energy);
  energyBar.style.right = (100-energy)+"%";
  energyBar.style.backgroundColor = (energy<50)? "#f25346" : "#68c3c0";
}

function addEnergy(){
  energy += 50;
  energy = Math.min(energy, 100);
}

function removeEnergy(){
  energy -= 15;
  energy = Math.max(0, energy);
}

function loop(){
  updatePlane();
  updateDistance();
  updateEnergy();
  //console.log("position:" + sky.mesh.position.x)
  if(sky.mesh.position.x < -2600){
    sky.mesh.position.x = 600
  }
  sky.mesh.position.x -= 0.5;
  if(typeof text !== 'undefined' && typeof text.mesh !== 'undefined'){
    text.mesh.position.x -= 1.5;
    textok.mesh.position.x -= 1.5;
    textnok.mesh.position.x -= 1.5;
    var distxok = airplane.mesh.position.x - textok.mesh.position.x;
    var distyok = airplane.mesh.position.y - textok.mesh.position.y;
    var distxnok = airplane.mesh.position.x - textnok.mesh.position.x;
    var distynok = airplane.mesh.position.y - textnok.mesh.position.y;
    var diffPos = airplane.mesh.position.clone().sub(textok.mesh.position.clone());
    var d = diffPos.length();
    
    if(distxok > 0 && distxok < 5 && distyok > 0 && distyok < 5){
      textok.mesh.position.y = 100;
      addEnergy();
    }

    if(distxnok > 0 && distxnok < 5 && distynok > 0 && distynok < 5){
      scene.remove(textnok.mesh);
      removeEnergy()
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updatePlane(){
  var targetY = normalize(mousePos.y,-.75,.75,25, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  airplane.propeller.rotation.x += 0.3;
}

function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
      createText(font, 'Ceci est un texte     trou', 'a', 'de', 110);
    });
  }

function createText(font, str, ok, nok, distance){
  text = new Text(font, str);
  text.mesh.position.y = 100;
  text.mesh.position.x = 600;
  scene.add(text.mesh);

  textok = new Text(font, ok);
  textok.mesh.position.y = 120;
  textok.mesh.position.x = 600 + distance;
  scene.add(textok.mesh);

  textnok = new Text(font, nok);
  textnok.mesh.position.x = 600 + distance;
  textnok.mesh.position.y = 80;
  scene.add(textnok.mesh);
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createPlane();
  createSky();
  loadFont();
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
