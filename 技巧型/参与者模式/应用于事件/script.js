// 函数绑定
function bind(fn, context) {
  // 必包返回新函数
  return function(){
    // 对 fn 装饰并返回
    return fn.apply(context, arguments);
  }
}

var btn = document.getElementById('clickMe');
var p = document.getElementsByTagName('p')[0];

var Options = document.getElementsByTagName('button');

function demoFn() {
  console.log('>>>');
  console.log(arguments, this);
}

var bindFn = bind(demoFn);
var bindFn_2 = bind(demoFn, btn);
var bindFn_3 = bind(demoFn, p);

Options[0].onclick = function() {
  btn.removeEventListener('click', bindFn);
  btn.addEventListener('click', bindFn);
}

Options[1].onclick = function() {
  btn.removeEventListener('click', bindFn);
  btn.addEventListener('click', bindFn_2);
}

Options[2].onclick = function() {
  btn.removeEventListener('click', bindFn);
  btn.addEventListener('click', bindFn_3);
}

Options[3].onclick = function() {
  btn.removeEventListener('click', bindFn);
}

// btn.addEventListener('click', bindFn_1);
// btn.addEventListener('click', bindFn_1);
// btn.addEventListener('click', bindFn_1);
