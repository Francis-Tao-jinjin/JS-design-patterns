~(function(){
    // 在闭包中获取全局变量
    var window = this || (0, eval)('this');
    // 获取页面字体大小，作为创建页面 UI 尺寸参照物
    var FONTSIZE = function(){
        // 获取页面 body 元素字体大小并转化为整数
        return parseInt(document.body.currentStyle ? 
                            document.body.currentStyle['fontSize'] : 
                            getComputedStyle(document.body, false)['fontSize']);
    }();
    console.log('font-size:', FONTSIZE); // 16

    // 视图模型对象
    var VM = function(){
        // 组件创建策略对象
        var Method = {
            // 进度条组件创建方法
            /**
             * dom      进度条容器
             * data     进度条数据模型
             */
            progressbar : function(dom, data){
                // 进度条完成容器
                var progress = document.createElement('div'),
                    // 数据模型数据，结构： {position ： 50}
                    param = data.data;
                // 设置进度条完成容器尺寸
                progress.style.width = (param.position || 100) + '%';
                // 为进度条组件添加 UI 样式
                dom.className += ' ui-progressbar';
                dom.style.position = 'relative';
                // 进度条完成容器元素插入进度条容器中
                dom.appendChild(progress);
            },
            // 滑动条组件创建方法
            /**
             * dom      滑动条容器
             * data     滑动条数据模型
             */
            slider : function(dom, data){
                // 滑动条拨片
                var bar = document.createElement('span'),
                    // 滑动条进度容器
                    progress = document.createElement('div'),
                    // 滑动条容量提示信息
                    totleText = null,
                    // 滑动条拨片提示信息
                    progressText = null,
                    // 数据模型数据，结构： {position ： 60, total : 200}
                    param = data.data,
                    // 容器元素宽度
                    width = dom.clientWidth,
                    // 元素容器横坐标值
                    left = dom.offsetLeft,
                    // 拨片位置（以模型数据中 position 数据计算）
                    realWidth = (param.position || 100) * width / 100;
                // 清空滑动条容器，为创建滑动条做准备
                dom.innerHTML = '';
                // 如果模型数据中提供容器总量信息（param.total），则创建滚动条提示文案
                if(param.total) {
                    // 容器总量提示文案
                    text = document.createElement('b');
                    // 拨片位置提示文案
                    progressText = document.createElement('em');
                    // 设置容器总量提示文案
                    text.innerHTML = param.total;
                    // 将容器总量提示文案元素添加到滑动条组件中

                    text.style.position = 'absolute';
                    text.style.left = 560+'px';
                    progressText.style.position = 'absolute';

                    dom.appendChild(text);
                    
                    dom.appendChild(progressText);
                }
                // 设置滑动条
                setStyle(realWidth);
                // 为滑动条组件添加 UI 样式
                dom.className += ' ui-slider';

                dom.style.position = 'relative';

                dom.appendChild(progress);
                dom.appendChild(bar);
                // 设置滑动条
                function setStyle(w) {
                    progress.style.width = w+'px';

                    bar.style.top = -2+'px';
                    bar.style.left = w - FONTSIZE/2 +'px';
                    bar.style.width = FONTSIZE+'px';
                    bar.style.height = '35px';
                    bar.style.position = 'absolute';
                    bar.style.background = 'cadetblue';

                    if(progressText){
                        progressText.style.left = w- FONTSIZE/2*2.4 +'px';
                        progressText.innerHTML = parseFloat(w/width*100).toFixed(2) + '%';
                    };
                }

                // 创建组件逻辑
                // 按下鼠标拨片
                bar.onmousedown = function(){
                    // 移动拨片（鼠标光标在页面中滑动，事件绑定给 document 是为了优化交互体验，
                    // 使鼠标光标可以在页面中自由滑动）
                    document.onmousemove = function(event) {
                        console.log('data is:', data);
                        // 获取事件源
                        var e = event || window.event;
                        // 鼠标光标相对于滑动条容器位置远点移动的横坐标
                        var w = e.clientX - left;
                        setStyle(w<width ? (w>0 ? w : 0) : width);
                    }
                    // 阻止页面滑动选取事件
                    document.onselectstart = function(){
                        return false;
                    }
                    // 停止滑动交互
                    document.onmouseup = function() {
                        // 取消文档鼠标光标移动事件
                        document.onmousemove = null;
                        
                        document.onselectstart = null;
                    }
                }
            }
        }

        /**
         * 获取视图层组件渲染数据的映射信息
         * dom      组件渲染
         */
        function getBindData(dom) {
            // 获取组件自定义属性 data-bind 值 
            var data = dom.getAttribute('data-bind');
            // 将自定义属性 data-bind 值转化为对象
            return !!data && (new Function("return ({"+data+"})"))();
        }

        /**
         * 组件实例化方法
         */
        return function(){
            // 获取页面中所有元素
            var doms = document.body.getElementsByTagName('*'),
                // 元素自定义数据句柄
                ctx = null;
            // ui 处理是会向页面中插入元素，此时 doms.length 会改变，此时动态获取 dom.length 
            for(let i=0; i<doms.length; i++){
                // 获取元素自定义数据
                ctx = getBindData(doms[i]);
                // 如果元素是 UI 组件，则根据自定义属性中组件类型，渲染该组件
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i], ctx);
            }
        }
    }();
    // 将试图模型对象绑定在 window 上，供外部获取
    window.VM = VM;
})();


var demo1 = {
    position : 60,
    total : 200
};
var demo2 = {
    position : 20,
};
var demo3 = {
    position : 50
};

window.onload = function(){
    // 渲染组件
    VM();
}