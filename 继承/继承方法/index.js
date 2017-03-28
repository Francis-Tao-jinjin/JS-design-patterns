/**
* 原型式继承
**/
function inheritObject(o) {
  // 声明一个过渡函数
  function F(){}
  // 过渡对象的原型继承父对象
  F.prototype = o;

  return new F();
}


/**
* 寄生式继承 继承原型
* 传递参数 subClass 子类
* 传递参数 superClass 父类
**/

function inheritPrototype(subClass, superClass) {
  // 复制一份父类的原型在变量 p 中
  var p = inheritObject(superClass.prototype);
  // 修正因为重写子类原型导致子类的 constructor 属性被修改
  p.constructor = subClass;
  // 设置子类原型
  subClass.prototype = p;
}

// 寄生式继承
var book = {
  name: "js book",
  alikeBook: ['css book', 'html book']
}

function createBook(obj) {
  var o = inheritObject(obj);
  o.getName = function() {
    console.log(this.name);
  }
  return o;
}

var newBook = createBook(book);
newBook.getName();




