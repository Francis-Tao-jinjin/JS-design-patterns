
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

//😐😐😐😐😐😐😐😐😐😐😐😐😐😐😐😐
//======================================

/*
* 新闻虚拟父类
*/
var News = function() {
  // 子组件容器
  this.children = [];
  // 当前组件的元素
  this.element = null;
}

News.prototype = {
  init: function() {
    // 防止子类没有没有重写而直接调用
    throw new Error('请重写方法');
  },
  add: function() {
    // 防止子类没有没有重写而直接调用
    throw new Error('请重写方法');
  },  
  getElement: function() {
    // 防止子类没有没有重写而直接调用
    throw new Error('请重写方法');
  }
}

/*
* 显现新闻模块的容器类
*/

// 容器类构造函数
var Container = function(id, parent) {
  // 构造函数继承父类
  News.call(this);
  // 模块 id
  this.id = id;
  // 模块的父容器
  this.parent = parent;
  // 构建方法
  this.init();
}
// 寄生式继承父类方法
inheritPrototype(Container, News);
// 构建方法，重写原型方法
Container.prototype.init = function() {
  this.element = document.createElement('ul');
  this.element.id = this.id;
  this.element.className = 'new-container';
};
// 添加子元素方法
Container.prototype.add = function(child) {
  this.children.push(child);
  // 插入当前组件元素树
  this.element.appendChild(child.getElement());
  return this;
};
// 获取当前元素方法
Container.prototype.getElement = function() {
  return this.element;
}
// 显示当前元素
Container.prototype.show = function() {
  this.parent.appendChild(this.element);
}


/*
* Container 下一层级的行成员集合类以及后面的新闻组合体类
*/

/*
* Item
*/
var Item = function(className) {
  News.call(this);
  this.className = className || '';
  this.init();
}
inheritPrototype(Item, News);

Item.prototype.init = function() {
  this.element = document.createElement('li');
  this.element.className = this.className;
}
// 添加子元素方法
Item.prototype.add = function(child) {
  this.children.push(child);
  // 插入当前组件元素树
  this.element.appendChild(child.getElement());
  return this;
};
// 获取当前元素方法
Item.prototype.getElement = function() {
  return this.element;
}
/*
* NewsGroup
*/
var NewsGroup = function(className) {
  News.call(this);
  this.className = className || '';
  this.init();
}
inheritPrototype(NewsGroup, News);

NewsGroup.prototype.init = function() {
  this.element = document.createElement('div');
  this.element.className = this.className;
}
// 添加子元素方法
NewsGroup.prototype.add = function(child) {
  this.children.push(child);
  // 插入当前组件元素树
  this.element.appendChild(child.getElement());
  return this;
};
// 获取当前元素方法
NewsGroup.prototype.getElement = function() {
  return this.element;
}

//😛😛😛😛😛😛😛😛😛😛😛😛😛😛😛😛
//======================================

/*
* 新闻类
*/

/*
* ImageNews
*/
var ImageNews = function(url, href, className) {
  News.call(this);
  this.url = url || '';
  this.href = href || '#';
  this.className = className || 'normal';
  this.init();
}
inheritPrototype(ImageNews, News);
ImageNews.prototype.init = function() {
  this.element = document.createElement('a');
  var img = new Image();
  img.src = this.url;
  this.element.appendChild(img);
  this.element.className = 'image-news' + this.className;
  this.element.href = this.href;
}
ImageNews.prototype.add = function(){}
ImageNews.prototype.getElement = function() {
  return this.element;
}

/*
* IconNews
*/
var IconNews = function(text, href, type) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.type = type || 'video';
  this.init();
}
inheritPrototype(IconNews, News);
IconNews.prototype.init = function() {
  this.element = document.createElement('a');
  this.element.innerHTML = this.text;
  this.element.className = 'icon' + this.type;
  this.element.href = this.href;
}
IconNews.prototype.add = function(){}
IconNews.prototype.getElement = function() {
  return this.element;
}

/*
* EasyNews
*/
var EasyNews = function(text, href) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.init();
}
inheritPrototype(EasyNews, News);
EasyNews.prototype.init = function() {
  this.element = document.createElement('a');
  this.element.innerHTML = this.text;
  this.element.className = 'text';
  this.element.href = this.href;
}
EasyNews.prototype.add = function(){}
EasyNews.prototype.getElement = function() {
  return this.element;
}

/*
* TypeNews
*/
var TypeNews = function(text, href, type, pos) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.type = type || '';
  this.pos = pos || 'left';
  this.init();
}
inheritPrototype(TypeNews, News);
TypeNews.prototype.init = function() {
  this.element = document.createElement('a');
  if (this.pos === 'left') {
    this.element.innerHTML = '[' + this.type + ']' + this.text;  
  } else {
    this.element.innerHTML = this.text + '[' + this.type + ']';  
  }
  this.element.className = 'text';
  this.element.href = this.href;
}
TypeNews.prototype.add = function(){}
TypeNews.prototype.getElement = function() {
  return this.element;
}


//😅😅😅😅😅😅😅😅😅😅😅😅😅😅😅😅😅😅
//==========================================

// 用上面的来创建新闻模块
// Container -> Item/(Item->NewsGroup) -> IconNews/EasyNews/TypeNews
// 父模块调用 add 将子模块添加进去

var news1 = new Container('news', document.body);
news1.add(
  new Item('normal').add(
    new IconNews('恐怖袭击后 伦敦人这样表达团结', '#', 'video')
  )
).add(
  new Item('normal').add(
    new IconNews('一批英国文化瑰宝即将"东渡"中国', '#', 'picture')
  )
).add(
  new Item('normal').add(
    new NewsGroup('has-image').add(
      new ImageNews('https://pbs.twimg.com/profile_images/633913543587295232/654XBC1L_bigger.png', '#', 'samll')
    ).add(
      new EasyNews('【世預賽：中國隊1:0戰勝韓國隊】3月23日，在長沙舉行的2018年俄羅斯世界杯預選賽亞洲區12強賽中，中國隊1:0戰勝韓國隊。', '#')
    )
  )
).add(
  new Item('normal').add(
    new TypeNews('梅首相成为《时尚》女郎', '#', 'BBC', 'left')
  )
).add(
  new Item('normal').add(
    new TypeNews('香港特首选战鹿死谁手？', '#', 'HKNews', 'right')
  )
).show();


// 在用 html 测试的时候，添加以下 css 查看：
// #news {
//   width: 300px;
//   padding: 20px;
//   border: solid 1px gray;
// }

// #news:hover {
//   border-color: #ff661e;
// }

// #news li {
//   margin: 5px;
//   list-style: none;
//   color: #607D8B;
// }

// #news li a{
//   color: #607D8B;
//   text-decoration: none;
// }

// #news li div a{
//   // display: inline-block;
// }

// #news li .has-image {
//   min-height: 50px;
// }

// #news li img {
//   height: 50px;
//   float: left;
// }

// .has-image img {
//   margin-right: 5px;
// }


















