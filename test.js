var person = function(){
  this.name = "Rutger";
  this.lastName = "De Maeyer";
  this.returnFull = function(){
    return this.name + " " + this.lastName;
  }
  this.logFull = function(){
    console.log(this.name + " " + this.lastName);
  }
}

var ik = new person();

var gui = new dat.GUI();
gui.add(ik,'name');
