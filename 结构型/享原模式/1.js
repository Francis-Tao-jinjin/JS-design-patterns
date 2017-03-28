// 初始化页面
var container = document.createElement('div');
container.id = 'container';
var btn = document.createElement('button');
btn.id = 'next_page';
btn.innerText = '下一页';
document.body.appendChild(container);
document.body.appendChild(btn);


// 初始化数据
var article = [
  '朝鲜火箭发动机试验后：谁敢爬上金正恩的背？',
  '吉利投巨资 伦敦黑色出租车“变绿”',
  '俄罗斯前议员在乌克兰基辅酒店外遭枪杀',
  '日本“爱国”学校丑闻 安倍越陷越深',
  '“萨德”招致中国报复 韩国如何面对成难题',

  '分析：中国施压朝鲜，但仍然争取会谈',
  '日产英国推出伦敦黑出租与吉利竞争',
  '薄熙来庭审秘密证词再爆“惊人内幕”',
  '一批英国文化瑰宝即将"东渡"中国',
  '部分飞美航班禁带手提电脑：是因为“IS恐怖威胁”吗？',
  
  '中国足球：为什么赢韩国这么重要？',
  '巴西政府危机公关后 香港叫停巴西"黑心肉"'
]

var Flyweight = function() {
  // 已创建的元素
  var created = [];
  // 创建一个新闻包装器
  function create() {
    var dom = document.createElement('div');
    dom.style.margin = '5px';
    dom.style.background = '#e6e6e6';
    // 将容器插入新闻列表容器
    document.getElementById('container').appendChild(dom);
    // 缓存新创建的元素
    created.push(dom);
    // 返回创建的元素
    return dom;
  }
  return {
    // 获取创建新闻元素的方法
    getDiv: function() {
      if (created.length < 5) {
        return create();
      } else {
        // 因为要不停的获取元素，如果先判断
        // 当前轮到哪个元素的话，还要保存一个下标，
        // 直接 shift 再 push 就比较方便了
        // 获取第一个元素，并插入到最后面
        var div = created.shift();
        div.style.margin = '5px';
        div.style.background = '#e6e6e6';
        
        created.push(div);
        return div;
      }
    }
  }
}();

var page = 0,
    num = 5,
    len = article.length;

// 添加 5 条新闻

for (let i = 0; i<5; i++) {
  if(article[i]) {
    // 通过享原类获取创建的元素并写入新闻内容
    Flyweight.getDiv().innerHTML = i + ". " + article[i];
  }
}

// 下一页按钮绑定事件
document.getElementById('next_page').onclick = function(){
  if(article.length < 5) {
    return;
  }
  // 获取当前页的第一条新闻索引
  var n = ++page * num % article.length;
  var j = 0;
  // 插入 5 条新闻
  for(; j < 5; j++) {
    // 如果存在第 n+j 条则插入
    if(article[n+j]) {
      console.log(j);
      Flyweight.getDiv().innerHTML = j + ". " + article[n+j];
    } else {
      Flyweight.getDiv().innerHTML = '';
      page = -1;
    }
  }
}

























