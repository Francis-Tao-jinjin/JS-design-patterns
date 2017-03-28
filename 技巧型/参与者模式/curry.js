// 函数柯里化
function curry(fn) {
  // 缓存数组 slice 方法 Array.prototype.slice
  var Slice = [].slice;
  // 从第二个参数开始截取参数
  // 因为第一个参数是函数
  var args = Slice.call(arguments, 1);
  // 闭包返回新函数
  return function() {
    // 将参数转化为数组
    var addArgs = Slice.call(arguments);
    console.log('addArgs:', addArgs);
    // 拼接参数
    var allArgs = args.concat(addArgs);
    console.log('allArgs:', allArgs);
    // 返回新参数
    return fn.apply(null, allArgs);
  }
}

function add(num1, num2){
  return num1 + num2;
}

var add7and8 = curry(add, 7, 8);
console.log(add7and8(4));
