var version = 1;
var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");
ctx.fillStyle = "black";//make the background a bit black
ctx.fillRect(0,0,c.width,c.height);
var gui = new dat.GUI();
/////////////////////////////////////
var herbivores = [];
var plants = [];
var carnivores = [];
var scavengers = [];
var plantBuffer = 0;
var herbivoreEnergyBuffer = 0;
var CarnivoreEnergyBuffer = 0;
var fps;
////////////////////////////////////////
//some options
var opts = {
  startPlants: 500,
  startHerbivores: 20,
  startCarnivores: 20,
  plantGrowRate: 100, //how many plants there are spawned each second
  herbivoreSpeed: 1,
  carnivoreSpeed: 1,
  plantSize: 1,
  herbivoreMaxSize: 20,
  herbivoreMaxEnergy: 10, //each secons loses 1 energy
  carnivoreMaxSize: 20,
  carnivoreMaxEnergy: 10, //each secons loses 1 energy
  speedMultiplier: 1
};

function seed(){
  this.init = function(){
    //generate plants
    for(i=0; i < opts.startPlants; i++){
      plants[i] = {"x": rand(0,c.width), "y": rand(0,c.height)}
    }
    //generate herbivores
    for(i=0; i < opts.startHerbivores; i++){
      randVec = setToFixedVelocity(rand(-100,100) ,rand(-100,100), opts.herbivoreSpeed /10);
      herbivores[i] = {
        "x": rand(0,c.width),
        "y": rand(0,c.height),
        "size": rand(1,opts.herbivoreMaxSize),
        "vec_x": randVec.x,
        "vec_y": randVec.y,
        "energy": opts.herbivoreMaxEnergy
      }
    }
    //generate carnivores
    for(i=0; i < opts.startCarnivores; i++){
      randVec = setToFixedVelocity(rand(-100,100) ,rand(-100,100), opts.carnivoreSpeed /10);
      carnivores[i] = {
        "x": rand(0,c.width),
        "y": rand(0,c.height),
        "size": rand(1,opts.carnivoreMaxSize),
        "vec_x": randVec.x,
        "vec_y": randVec.y,
        "energy": opts.carnivoreMaxEnergy
      }
    }

  }
  //a reset function
  this.reset = function(){
    plants.splice(0,plants.length);
    herbivores.splice(0,herbivores.length);
    carnivores.splice(0,carnivores.length);
  }
}

function begin(){}

function update(delta){
  delta *= opts.speedMultiplier;
  fps = 1000 / delta;

  //add plants
  plantBuffer += delta/1000;
  for(i=0; plantBuffer >= 1; plantBuffer--){
    for(a=0;a <= opts.plantGrowRate; a++){
      plants.push({"x": rand(0,c.width), "y": rand(0,c.height)});
    }
  }

  //update herbivores
  for(i=0; i < herbivores.length; i++){
    //kill when no energy
    if(herbivores[i].energy <= 0){
      delete herbivores[i];
      console.log("herbivores "+herbivores.length);
    }
    //multiplication
    else if(herbivores[i].energy >= opts.herbivoreMaxEnergy && herbivores[i].size >= opts.herbivoreMaxSize) {

      for(a=0; a<=herbivores[i].size; a++){
        randVec = setToFixedVelocity(rand(-100,100) ,rand(-100,100), opts.herbivoreSpeed /10);
        herbivores.push({
          "x": herbivores[i].x,
          "y": herbivores[i].y,
          "size": 1,
          "vec_x": randVec.x,
          "vec_y": randVec.y,
          "energy": opts.herbivoreMaxEnergy
        });
      }

      delete herbivores[i];
    }
    else{
    //update location
    herbivores[i].x += delta * herbivores[i].vec_x;
    herbivores[i].y += delta * herbivores[i].vec_y;
    //update energy
    herbivoreEnergyBuffer += delta;
    if(herbivoreEnergyBuffer >= 1000){
      for(a=0; herbivoreEnergyBuffer >= 1000; herbivoreEnergyBuffer -= 1000){
        //minus energy
        if(herbivores[i].energy > 0){
          herbivores[i].energy--;
        }
      }
    }
    //check for border collisions
    if(herbivores[i].x <= 0){
      herbivores[i].vec_x *= -1;
    }
    if(herbivores[i].x >= c.width){
      herbivores[i].vec_x *= -1;
    }
    if(herbivores[i].y <= 0){
      herbivores[i].vec_y *= -1;
    }
    if(herbivores[i].y >= c.height){
      herbivores[i].vec_y *= -1;
    }
    //eating plants
    for(a=0; a<plants.length; a++){
      if((distance(plants[a].x, plants[a].y, herbivores[i].x, herbivores[i].y) - opts.plantSize - herbivores[i].size) <= 0){
        //eated
        delete plants[a];
        herbivores[i].size += opts.plantSize;
        if(herbivores[i].size > opts.herbivoreMaxSize){
          herbivores[i].size = opts.herbivoreMaxSize;
        }
        if(herbivores[i].energy < opts.herbivoreMaxEnergy){
          herbivores[i].energy += opts.plantSize;
          if(herbivores[i].energy+opts.plantSize > opts.herbivoreMaxEnergy){
            herbivores[i].energy = opts.herbivoreMaxEnergy;
          }
        }
      }
    }
    plants.clean();
    }
  }
  herbivores.clean();

  //update carnivores
  for(i=0; i < carnivores.length; i++){
    //kill when no energy
    if(carnivores[i].energy <= 0){
      delete carnivores[i];
      console.log("carnivores "+carnivores.length);
    }
    //multiplication
    else if(carnivores[i].energy >= opts.carnivoreMaxEnergy && carnivores[i].size >= opts.carnivoreMaxSize) {

      for(a=0; a<=carnivores[i].size; a++){
        randVec = setToFixedVelocity(rand(-100,100) ,rand(-100,100), opts.carnivoreSpeed /10);
        carnivores.push({
          "x": carnivores[i].x,
          "y": carnivores[i].y,
          "size": 1,
          "vec_x": randVec.x,
          "vec_y": randVec.y,
          "energy": opts.carnivoreMaxEnergy
        });
      }

      delete carnivores[i];
    }
    else{

    //update location
    carnivores[i].x += delta * carnivores[i].vec_x;
    carnivores[i].y += delta * carnivores[i].vec_y;
    //update energy
    CarnivoreEnergyBuffer += delta;
    if(CarnivoreEnergyBuffer >= 1000){
      for(a=0; CarnivoreEnergyBuffer >= 1000; CarnivoreEnergyBuffer -= 1000){
        //minus energy
        if(carnivores[i].energy > 0){
          carnivores[i].energy--;
        }
      }
    }
    //check for border collisions
    if(carnivores[i].x <= 0){
      carnivores[i].vec_x *= -1;
    }
    if(carnivores[i].x >= c.width){
      carnivores[i].vec_x *= -1;
    }
    if(carnivores[i].y <= 0){
      carnivores[i].vec_y *= -1;
    }
    if(carnivores[i].y >= c.height){
      carnivores[i].vec_y *= -1;
    }
    //eating herbivores
    for(a=0; a<herbivores.length; a++){
      if((distance(herbivores[a].x, herbivores[a].y, carnivores[i].x, carnivores[i].y) - herbivores[a].size - carnivores[i].size) <= 0 && herbivores[a].size <= carnivores[i].size){
        //eated
        carnivores[i].size += herbivores[a].size;
        if(carnivores[i].size > opts.carnivoreMaxSize){
          carnivores[i].size = opts.carnivoreMaxSize;
        }
        if(carnivores[i].energy < opts.carnivoreMaxEnergy){
          carnivores[i].energy += herbivores[a].size;
          if(carnivores[i].energy+herbivores[a].size > opts.carnivoreMaxEnergy){
            carnivores[i].energy = opts.carnivoreMaxEnergy;
          }
        }
        delete herbivores[a];
      }
    }
    herbivores.clean();
  }
  }
  carnivores.clean();
}

function draw(){
  //clear canvas
  ctx.fillStyle = 'black'; //black is black...
  ctx.fillRect(0,0,c.width,c.height);
  //draw plants
  for(i=0; i < plants.length; i++){
    ctx.beginPath();
    ctx.arc(plants[i].x, plants[i].y, opts.plantSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#128016';
    ctx.stroke();
  }
  //draw herbivores
  for(i=0; i < herbivores.length; i++){
    ctx.beginPath();
    ctx.arc(herbivores[i].x, herbivores[i].y, herbivores[i].size, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
  //draw carnivores
  for(i=0; i < carnivores.length; i++){
    ctx.beginPath();
    ctx.arc(carnivores[i].x, carnivores[i].y, carnivores[i].size, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
  //draw text
  ctx.font="20px Ubuntu";
  ctx.fillStyle="white";
  ctx.fillText("Plants " + plants.length, 10, 30);
  ctx.fillText("Herbivores " + herbivores.length, 10, 60);
  ctx.fillText("Carnivores " + carnivores.length, 10, 90);
  ctx.fillText("FPS " + fps, 10, 150);
}

var seed = new seed();
seed.init();
MainLoop.setBegin(begin).setUpdate(update).setDraw(draw).start();
gui.add(opts, 'startPlants');
gui.add(opts, 'startHerbivores');
gui.add(opts, 'startCarnivores');
gui.add(opts, 'plantGrowRate');
gui.add(opts, 'herbivoreSpeed');
gui.add(opts, 'carnivoreSpeed');
gui.add(opts, 'herbivoreMaxSize');
gui.add(opts, 'plantSize');
gui.add(opts, 'herbivoreMaxEnergy');
gui.add(opts, 'speedMultiplier');
gui.add(seed, 'init');
gui.add(seed, 'reset');
