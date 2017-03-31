/**
 * MVP 即模型 (Model) - 视图 (View) - 管理器 (Presenter) 。
 * View 层不直接引用 Model层内的数据，而是通过 Presenter 
 * 层实现对 Model 层内的数据访问 
 */

// 首相创建一个 MVP 单体对象
~(function(window) {
    // MVP 构造函数
    var MVP = function(modName, pst, data){
        MVP.model.setData(modName, data);
        // 在管理器层中添加 modName 管理器模块
        MVP.presenter.add(modName, pst);
    };
    // 数据层和 MVC 中的类似
    MVP.model = function(){
        var M = {};
        // 假设已经从后端获得数据并已经通过 setData 方法设置在数据层中
        M.data = {
            nav : [
                {
                    text : '新闻头条',
                    mode : 'news',
                    url  : 'http://www.example.com/01'
                },
                {
                    text : '最新电影',
                    mode : 'movie',
                    url  : 'http://www.example.com/02'
                },
                {
                    text : '热门游戏',
                    mode : 'game',
                    url  : 'http://www.example.com/03'
                },
                {
                    text : '今日特价',
                    mode : 'price',
                    url  : 'http://www.example.com/04'
                }
            ]
        };
        M.conf = {}
        return {
            getData : function(m) {
                return M.data[m];
            },
            /**
             * 设置数据
             * @param   m   模块名称
             * @param   v   模块数据
             */
            setData : function(m, v) {
                M.data[m] = v;
                return v;
            },
            getConf : function(c) {
                return M.conf[c];
            },
            /**
             * 设置配置
             * @param   c   配置项名称
             * @param   v   配置项值   
             */
            setConf : function(c, v) {
                M.conf[c] = v;
                return v;
            }
        }
    }();
    // 视图层
    MVP.view = function(){
        // 子元素或者兄弟元素替换模板
        var REPLACEKEY = '__REPLACEKEY__';
        // 获取完整元素模板
        /**
         * @name    获取完整元素模板
         * @param   str     元素字符串 
         * @param   type    元素类型
         */
        function getHTML(str, type){
            // 简化处理，只处理字符串中第一个{}里面的内容
            return str
                    .replace(/^(\w+)([^\{\}]*)?(\{([@\w]+)\})?(.*?)$/, function(match,$1,$2,$3,$4,$5){
                        $2 = $2 || '';  // 元素属性参数容错处理
                        $3 = $3 || '';  // {元素内容}采纳数容错处理
                        $4 = $4 || '';  // 元素内容参数容错处理
                        $5 = $5.replace(/\{([@\w]+)\}/g, '');   // 去除元素内容后面添加的元素属性
                                                                // 中的 {} 内容 
                        // 以 str = div 为例： 如果 div 元素有子元素则表示成
                        // <div>__REPLACEKEY__</div> ，如果 div 元素有兄弟元素
                        // 就表示成 <div></div>__REPLACEKEY__，否则表示成 <div></div>
                        return type === 'in' ? '<'+$1+$2+$5+'>'+$4+REPLACEKEY+'</'+$1+'>' : 
                                type === 'add' ? 
                                    '<'+$1+$2+$5+'>'+$4+'</'+$1+'>'+REPLACEKEY : 
                                    '<'+$1+$2+$5+'>'+$4+'</'+$1+'>'; 
                    }) // 处理特殊标识 #--id 属性 
                    .replace(/#([@\-\w]+)/g, ' id="$1"')
                    // 处理特殊标示 .--class 属性
                    .replace(/\.([@\-\s\w]+)/g, ' class="$1"')
                    // 出咯其他属性组
                    .replace(/\[(.+)\]/g, function(match, key){
                        // 元素属性组
                        var a = key // 过滤引号
                                .replace(/'|"/g, '')
                                .split(' '),
                            h = ''; //属性模板字符串
                        for(let j=0, len=a.length; j<len; j++){
                            // 处理并拼接每一个属性
                            h += ' ' + a[j].replace(/=(.*)/g, '="$1"');
                        }
                        // 返回属性组模板字符串
                        return h;
                    })
                    // 处理可替换内容，可根据不同模板渲染引擎自由处理
                    .replace(/@(\w+)/g, '{#$1#}');
        }

        /**
         * 数组迭代器
         * @param arr   数组
         * @param fn    回调函数
         */
        function eachArray(arr, fn){
            // 遍历数组
            for(let i=0, len=arr.length; i<len; i++){
                // 将索引值、索引对应值、数组长度传入回调函数中并执行
                fn(i, arr[i], len);
            }
        }
        /**
         * 替换兄弟元素模板或者子元素模板
         * @param str   原始字符串
         * @param rep   兄弟元素模板或者子元素模板
         */
        function formateItem(str, rep){
            // 用对应元素字符串替换兄弟元素模板或者子元素模板
            return str.replace(new RegExp(REPLACEKEY, 'g'), rep);
        }
        // 模板解析器
        return function(str){
            // 将 zen coding 的字符串解析成 html
            var part = str
                        .replace(/^\s+|\s+$/g, '')      // 去除首尾的空白
                        .replace(/^\s+(>)\s+/g, '$1')   // 去除‘>’两端的空白
                        .split('>');                    // 通过‘>’分组
            // 得到的 part 是层级已经分开的元素列表
            // 当然，如果有多个兄弟关系的外层元素， 
            // zen coding 就没有办法解决了，
            // 只能通过分开多个模板的方法编写

                // html     模块视图根模板
                // item     同级元素
                // nodeTpl  同级元素模板
            var html = REPLACEKEY, item, nodeTpl;

            // 为每个层级的元素应用下面的函数
            eachArray(part, function(partIndex, partValue, partLen){
                // 为同级元素分组
                item = partValue.split('+');
                // 设置同级元素初始模板
                nodeTpl = REPLACEKEY;
                // 遍历同级每一个元素
                eachArray(item, function(itemIndex, itemValue, itemLen) {
                    // 用渲染元素得到的模板去渲染同级元素模板， 此处简化逻辑处理
                    // 如果 itemIndex （同级元素渲染）对应元素不是最后一个，则作为兄弟
                    // 元素处理。否则，如果 partIndex（层级索引）对应的层级不是最后一层，
                    // 则作为父层级处理。（该层级有子层级，即钙元素是父元素）
                    // 否则，该元素无兄弟元素，无子元素
                    nodeTpl = formateItem(nodeTpl, 
                                        getHTML(itemValue, itemIndex === itemLen - 1?
                                                    (partIndex === partLen -1 ? '' : 'in') :
                                                     'add'));
                })
                html = formateItem(html, nodeTpl);
            });
            return html;
        }
    }();
    // 管理层
    MVP.presenter = function(){
        var V = MVP.view;
        var M = MVP.model;
        var C = {
            /**
             * 导航管理器
             * @param   M   数据层对象
             * @param   V   视图层对象
             */
            nav : function(M, V){
                // 获取导航渲染数据
                var data = M.getData('nav');
                // 处理导航渲染数据
                data[0].choose = 'choose';
                data[data.length - 1].last = 'last';
                // 获取导航渲染模板
                var tpl = V('li.@mode @choose @last[data-mode=@mode]>'+
                                'a#nav_@mode.nav-@mode[href=@url title=@text]>'+
                                    'i.nav-icon-@mode+span{@text}');
                $.create('ul', {
                    'class' : 'navigation',
                    'id'    : 'nav'
                }).html( A.formateString(tpl, data))
                .appendTo('#container');


                /**
                 * appendTo 之后再编写页面行为的代码
                 */
            }
        };
        return {
            // 执行方法
            init : function(){
                // 遍历内部管理器
                for(let i in C) {
                    // 执行所有管理器内部逻辑
                    C[i] && C[i](M, V, i);
                }
            },
            /**
             * 为管理器添加模块
             * @param   modName     模块名称
             * @param   pst         模块管理器
             */
            add : function(modName, pst){
                C[modName] = pst;
                return this;
            }
        };
    }();
 
    // MVP 入口
    MVP.init = function(){
        this.presenter.init();
    };
    // 暴露 MVP 对象, 这样即可在外部访问 MVP
    window.MVP = MVP;
})(window);

window.onload = function(){
    MVP.init();
}

