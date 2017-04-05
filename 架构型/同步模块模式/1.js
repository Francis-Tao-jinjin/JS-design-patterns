// 定义模块管理器单体对象
var F = F || {};
/*
* 定义模块方法
* @param str 模块路由
* @param fn
*/

F.define = function(str, fn) {
  // 解析模块路由
  var parts = str.split('.'),
      old = parent = this,
      i = len = 0;

  if(parts[0] === 'F') {
    parts = parts.slice(1);
  }
  // 屏蔽对 define 与 module 模块方法的重写
  if(parts[0] === 'define' || parts[0] === 'module') {
    return;
  }
  // 遍历里路由模块并定义每层模块
  for(len = parts.length; i<len; i++) {
    // 如果父模块中不存在当前模块
    if(typeof parent[parts[i]] === 'undefined') {
      // 声明当前模块
      parent[parts[i]] = {};
    }
    // 缓存下一层级的祖父模块
    old = parent;
    // 缓存下一层级父模块
    parent = parent[parts[i]];
  }
  // 如果给定模版方法则定义该模块方法
  if(fn) {
    // 此时 i 等于 parts.length, 故减一
    old[parts[--i]] = fn();
  }
  // 返回模块管理器单体对象
  return this;
}

// 使用 define 定义的 F.string 模块
F.define('string', function() {
  // 接口方法
  return {
    // 清除字符两边的空白
    trim: function(str) {
      return str.replace('/^\s+|\s+$/g', '');
    }
  }
});


F.define('dom', function() {
  // 简化获取元素方法
  var $ = function(id) {
    console.log('in $');
    $.dom = document.getElementById(id);
    // 返回构造函数对象
    return $;
  }

  // 获取或设置元素内容
  $.html = function(html){
    if(html) {
      this.dom.innerHTML = html;
      return this;
    } else {
      return this.dom.innerHTML;
    }
  }
  return $;
});
var btn_1 = document.getElementById('btn1');
btn_1.addEventListener('click', function(){
  console.log('in btn_1 onclick');
  // 测试用例（页面元素：<div id="test">test</div>）
  console.log(F.dom('test').html()); // 'test'
});

// 模块调用方法
F.module = function() {
  // 将参数转化为数组
  var args = [].slice.call(arguments),
      // 获取回调执行函数，回调函数为最后一个参数
      fn = args.pop(),
      // 获取依赖模块，如果 args[0] 是数组，
      // 则依赖模块为 args[0]。 否则依赖模块为 arg
      parts = args[0] && args[0] instanceof Array ? args[0] : args;
      // 依赖模块列表
  var modules = [],
      //  模块路由
      modIDs = '',
      // 以来模块索引
      i=0;
      // 依赖模块长度
  var ilen=parts.length,
      // 父模块，模块路由层级索引，模块路由层级长度
      parent, j, jlen;
  // 遍历依赖模块
  while(i<len) {
    // 如果是模块路由
    if(typeof parts[i] === 'string') {
      // 设置当前模块父对象（F）
      parent = this;
      // 解析模块路由，并屏蔽掉模块父对象
      modIDs = parts[i].replace(/^F\./, '').split('.');
      // 遍历模块路由层级
      for(j=0, jlen=modIDs.length; j<jlen; j++) {
        // 重置父模块
        parent = parent[modIDs[j]] || false;
      }
      // 将模块添加到依赖模块列表中
      modules.push(parent);
    // 如果是模块对象
    } else {
      // 直接加入到依赖模块列表中
      modules.push(parts[i]);
    }
    // 取下一个依赖模块
    i++;
  }
  // 执行回调执行函数
  fn.apply(null, modules);
}

F.module(['dom', document], function(dom, doc) {
  // 通过 dom 模块设置元素内容
  dom('test').html('new add!');
  // 通过 document 设置 body 元素背景色
  doc.body.style.background = 'red';
});

















