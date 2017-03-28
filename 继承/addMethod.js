Function.prototype.addMethod = function(name, fn){
  this.prototype[name] = fn;
  this[name] = fn;
}

var func = function(){
}

func.addMethod('innerFunc', function(){
  console.log('this is inner func');
});

var a = new func();
a.innerFunc();

func.innerFunc();
