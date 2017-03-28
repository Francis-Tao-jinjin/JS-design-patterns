var O = function() {
  this.secondFunc = function() {
    console.log('second function');
  }
}

O.prototype.innerFunc = function() {
  console.log('inner function');
}

var B = function() {
  this.name = 'I\'b.';
}
B.prototype.logName = function() {
  console.log('name', this.name);
}



var C = {
  name : 'I\'c.'
}
C.greet = function() {
  console.log('name', this.name);
}
C.greet();

var c = new C();
