/*
* 创建一个观察者👀，将观察者放在一个闭包中，当页面加载完成时会自动执行
*/
var Observer = (function() {
  var __messages = {};
  return {
    // 注册信息接口
    regist: function(type, fn){
      if(typeof __messages[type] === 'undefined') {
        __messages[type] = [fn];
      } else {
        __messages[type].push(fn);
      }
      return this;
    },
    // 发布信息接口
    fire: function(type, args){
      if(typeof __messages[type] === 'undefined') {
        return;
      } else {
        // 定义消息信息
        var events = {
          type: type,   // 消息类型
          args: args || {}  // 消息携带数据
        },
        i = 0,
        len = __messages[type].length;
        // 遍历消息动作
        for(; i<len; i++) {
          // 依次执行注册的消息对应的动作序列
          __messages[type][i].call(this, events);
        }
      }
      return this;
    },
    // 移除信息接口
    remove: function(type, fn){
      // 如果消息动作队列存在
      if(__messages[type] instanceof Array) {
        // 从最后一个消息动作遍历
        var i = __messages[type].length - 1;
        for(; i>=0; i--) {
          __messages[type][i] === fn && __messages[type].splice(i, 1);
        }
      }
      return this;
    }
  }
})();

/*
* 简单的测试
*/

Observer.regist('test', function(e) {
  console.log(e.type, e.args.msg);
});

Observer.fire('test', { msg: '传递参数'});
// >>> test 传递参数

/*
* 正式实现消息注册功能的两个模块。首先是用户追加评论的功能的实现
* ⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁⏁
*/

// 外观模式，简化获取元素
function $(id) {
  if(id[0] === '#'){
    return document.getElementById(id.slice(1));  
  } else if (id[0] === '.' ) {
    return document.getElementByClassName(id.slice(1));
  } else {
    return document.getElementByTagName(id);
  }
}

// 工程师 A
(function() {
  // 追加一则消息
  function addMsgItem(e) {
    var text = e.args.text,             // 获取消息中用户添加的文本内容
        ul = $('#msg'),                 // 留言容器元素
        li = document.createElement('li'),  // 创建内容容器
        span = document.createElement('span'); // 删除按钮
        span.className = 'del'
        span.innerText = '⌫';

    li.innerHTML = text;                // 写入评论
    // 关闭按钮
    span.onclick = function(){
      ul.removeChild(li);
      // 发布删除留言消息
      Observer.file('removeCommentMessage', {
        num: -1
      });
    }
    // 添加删除按钮
    li.appendChild(span);
    // 添加留言节点
    ul.appendChild(li);
  }
  Observer.regist('addCommentMessage', addMsgItem);
})();

// 工程师 B
(function(){
  function changeMsgNum(e) {
    // 获取需要增加的用户消息数目
    var num = e.args.num;
    // 增加用户消息数目并写入页面
    $('#msg_num').innerHTML = parseInt($('#msg_num').innerHTML) + num;
  }
  // 注册添加评论信息
  Observer
    .regist('addCommentMessage', changeMsgNum)
    .regist('removeCommentMessage', changeMsgNum);
})();

// 工程师 C
(function(){
  $('#user_submit').onclick = function() {
    // 获取用户输入框中的内容
    var text = $('#user_input');
    // 如果消息为空则提示消息提交失败
    if(text.value === '') {
      return;
    }
    // 发布一则评论消息
    Observer.fire('addCommentMessage', {
      text: text.value,     // 消息评论内容
      num: 1                // 消息评论数目
    });
    text.value = '';        // 将输入框置为空
  }
})();





























