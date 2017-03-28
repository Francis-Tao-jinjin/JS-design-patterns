// 函数绑定
function bind(fn, context) {
  // 必包返回新函数
  return function(){
    // 对 fn 装饰并返回
    return fn.apply(context, arguments);
  }
}

// 测试，创建一个 demoObj 和 demoFn，
// 然后让 demoObj 参与 demoFn 的执行，并保存在 bindFn 中，
// 观察 bindFn 和 demoFn 的区别。

var demoObj = {
  title: 'This is the title of demoObj'
}

var demoFn = function() {
  console.log('inside demo fn, title is:', this.title);
}

// bindFn 是让 demoObj 寄生在其中，并在执行的时候才让
// demoObject 加入的，所以 bindFn 和 demoFn 是两个不同的函数
var bindFn = bind(demoFn, demoObj);
var bindFn_2 = bind(bindFn, demoObj);

demoFn();
bindFn();
bindFn_2();
console.log('demoFn === bindFn ?', demoFn === bindFn);
console.log('bindFn_2 === bindFn ?', bindFn_2 === bindFn);