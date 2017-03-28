/*
* 等待者对象
*/
var Waiter = function() {
  // 注册了的等待对象
  var dfd = [],         // 注册了的等待者对象容器
      doneArr = [],     // 成功回调方法容器
      failArr = [],     // 失败回调方法容器
      Slice = [].slice, 
      that = this;      // 保存当前等待者对象

  // 监控对象类 MyPromise
  var MyPromise = function() {
    this.resolved = false;  // 监控对象是否解决成功状态
    this.rejected = false;  // 监控对象是否解决失败状态
  }
  MyPromise.prototype = {
    // 解决成功
    resolve: function() {
      // 当前监控对象成功解决
      this.resolved = true;
      // 如果没有监控对象则取消执行
      // console.log('insede resolve, dfd:',dfd);
      if(!dfd.length) {
        return;
      }
      // 遍历所有注册了的监控对象
      for(var i=dfd.length - 1; i>=0; i--) {
        // 如果有任意一个监控对象没有被解决或者解决失败则返回
        if(dfd[i] && !dfd[i].resolved || dfd[i].rejected) {
          return;
        }
        // 清除监控对象
        dfd.splice(i, 1);
      }
      // 执行解决成功回调方法
      _exec(doneArr);
    },
    // 解决失败
    reject: function() {
      // 设置当前监控对象解决失败
      this.rejected = true;
      // 如果没有监控对象则取消执行
      if(!dfd.length) {
        return;
      }
      // 清除所有监控对象
      dfd.splice(0);
      // 执行解决成功回调方法
      _exec(failArr);
    } 
  }

  // 创建监控对象
  that.Deferred = function() {
    return new MyPromise();
  }

  // 回调执行方法
  function _exec(arr){
    var i = 0;
    var len = arr.length;
    // 遍历回调数组执行回调
    for(; i<len; i++) {
      try {
        // 执行回调函数
        arr[i] && arr[i]();
      }catch(e){}
    }
  }

  // 监控异步方法 参数：监控对象
  that.when = function(){
    // 设置监控对象
    dfd = Slice.call(arguments);
    // console.log('inside when, dfd:',dfd);
    // 获取监控对象数组长度
    var i = dfd.length;
    // 向前遍历监控对象，最后一个监控对象的索引值为 length-1
    for(--i; i>=0; i--) {
      // 如果不存在监控对象，或者监控对象已经解决，或者不是监控对象
      if(!dfd[i] || dfd[i].resolved || 
          dfd[i].rejected || !dfd[i] instanceof MyPromise) {
        dfd.splice(i, 1);
      }
    }
    // console.log('before leave when');
    // 返回等待者对象
    return that;
  };

  // 解决成功回调函数添加方法
  that.done = function(){
    // 向成功回调函数容器中添加回调方法
    doneArr = doneArr.concat(Slice.call(arguments));
    // console.log('doneArr is,', doneArr);
    // 返回等待者对象
    return that;
  };
  // 解决失败回调函数添加方法
  that.fail = function(){
    // 向失败回调函数容器添加回调方法
    failArr = failArr.concat(Slice.call(arguments));
    // 返回等待对象
    // console.log('failArr is,', failArr);
    return that;
  };
}

var waiter = new Waiter();
// 第一个，2 秒后停止
var first = function(){
  // 创建监听对象
  var dtd = waiter.Deferred();
  setTimeout(function() {
    // console.log('first finish');
    // 发布解决成功消息
    dtd.resolve();
  }, 2000);
  // console.log('first created');
  return dtd;
}();

// 第二个，4 秒后停止
var second = function(){
  // 创建监听对象
  var dtd = waiter.Deferred();
  setTimeout(function() {
    // console.log('second finish');
    // 完成时调用 resolve 方法，使 waiter 检查当前还有没有未完成的任务
    dtd.resolve();
  }, 4000);
  // console.log('second created');
  return dtd;
}();

console.log('first', first);
console.log('second', second);

// 首先调用 when 方法，该方法会将创建的监听对象添加到 waiter 的等待对象中
waiter.when(first, second)
      .done(function() {
        console.log('success');
      }, function() {
        console.log('success again');
      })
      .fail(function() {
        console.log('fail');
      });





























