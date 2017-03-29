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

F.define('string', function() {
  // 接口方法
  return {
    // 清除字符两边的空白
    trim: function(str) {
      return str.replace('/^\s+|\s+$/g', '');
    }
  }
});

// 对于
F.define('dom', function() {
  var $ = function(id) {
    $.dom = document.getElementById(id);
    return $;
  }
  // 获取或设置元素内容
  $.html = function(html) {
    // 如果传参则设置元素内容，否则获取元素内容
    if(html) {
      this.dom.innerHTML = html;
      return this;
    } else {
      return this.dom.innerHTML;
    }
  }
}) 

















