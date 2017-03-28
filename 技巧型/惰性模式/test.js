var A = {}

var BROWSER = 'Chrome';
A.test = function() {
  console.log('in test');
  if(BROWSER === 'Chrome') {
    console.log('After test, your Browser is Chrome');
    // 在运行过一次之后就可以记住选择的结果，并将方法重定义，
    // 这样就不需要再做重复的分支判断了
    A.test = function() {
      console.log('Your Browser is Chrome');
    }
  } else if(BROWSER === 'FireFox') {
    console.log('After test, your Browser is FireFox');
    A.test = function() {
      console.log('Your Browser is FireFox');
    }
  } else {
    console.log('After test, your Browser is IE6');
    A.test = function() {
      console.log('Your Browser is IE6');
    }
  }
  // 加上这一句，这样函数在外部第一次被调用的时候就可以完成函数重定义
  // 如果没有这一句，那么函数在外部是完成第一调用的时候才会尽心函数重定义
  // 但是对于需要有返回值的函数来说，这一行必不可少
  A.test();
}

A.test();
A.test();
