$(function() {
    var MVC = MVC || {};
    // 初始化 MVC 数据模型层
    MVC.model = function(){
        console.log('MVC.model');
        // 内部数据对象
        var M = {};
        M.data = {
            // 左侧侧边栏导航服务器端请求得到的响应数据
            slideBar : [
                {
                    text : 'JS',
                    icon : './js_1.png',
                    title: 'Next Gen JS',
                    content: 'Js, ECMAScript, TypeScrit',
                    img  : './js_1.png',
                    href : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
                },
                {
                    text : 'Python',
                    icon : './python_1.png',
                    title: 'Quick & Sexy',
                    content: 'As easy as it can be',
                    img  : './python_2.png',
                    href : 'https://www.python.org/'
                },
                {
                    text : 'Haskell',
                    icon : './haskell_1.png',
                    title: 'Hack the Genius',
                    content: 'Pure Functional language',
                    img  : './haskell_2.png',
                    href : 'https://www.haskell.org/'
                }
            ]
        };
        M.conf = {
            // 侧边导航动画配置数据
            slideBarCloseAnimate : false
        };
        return {
            getData : function(m) {
                return M.data[m];
            },
            // 获取配置数据
            getConf : function(c) {
                // 根据配置数据字段获取配置数据
                return M.conf[c]
            },
            setData : function(m, v) {
                // 设置数据字段 m 对应的数据 v
                M.data[m] = v;
                return this;
            },
            setConf : function(c, v) {
                M.conf[c] = v;
                return this;
            }
        }
    }();

    // 初始化 MVC 视图层
    MVC.view = function(){
        console.log('MVC.view');
        // 模型数据层对象操作方法引用
        var M = MVC.model;
        // 内部试图创建方法对象
        var V = {
            // 创建侧边导航模块视图
            createSlideBar : function(){
                console.log('inside createSlideBar');
                // 导航图标内容
                var html = '',
                    data = M.getData('slideBar');
                console.log('got data:', data);
                if(!data || !data.length) {
                    return;
                }

                var dom = $.create('div', {
                    'class' : 'slidebar',
                    'id'    : 'slidebar'
                });

                var tpl = {
                    container : [
                        '<div>',
                            '<button id="addItem">添加侧边栏数据</button>',
                            '<button id="renderItem">渲染侧边栏</button>',
                        '</div>',
                        '<div class="slidebar-inner"><ul>{#content#}</ul></div>',
                        '<a hidefocus href="#" class="slidebar-close" title="收起">收起</a>',
                    ].join(''),
                    item : [
                        '<li>',
                            '<a class="icon" href="{#href#}">',
                                '<img src="{#icon#}"/>',
                                '<span>{#text#}</span>',
                            '</a>',
                            '<div class="box">',
                                '<div>',
                                    '<a class="title" href="{#href#}">{#title#}</a>',
                                    '<a href="{#href#}">{#content#}</a>',
                                '</div>',
                                '<a class="image" href="{#href#}"><img src="{#img#}"/></a>',
                            '</div>',
                        '</li>',
                    ].join('')
                };
                // 渲染全部导航图片模块
                for(let i=0, len = data.length; i<len; i++) {
                    html += $.formateString(tpl.item, data[i]);
                }
                console.log('html is:', html);
                // 在页面中创建侧边导航视图
                dom.html($.formateString(tpl.container, {content: html})).appendTo('body');
            }
            // ,
            // updateSlideBar : function() {
            //     var dom = $('slidebar');
            //     dom.html()
            // }
        };
        // 获取试图接口方法
        return function(v) {
            // 根据试图名称返回试图，由于获取的是一个方法
            // 所以需要将该方法执行一次一伙的相应的试图
            V[v]();
        }
    }();

    /**
     * 视图层对象保存着对应组件内部的试图，为了创建这些
     * 视图，还需要在视图层内部引用模型数据对象以操作模型
     * 数据对象内部的数据。
     */
    // 初始化 MVC 控制层

    /**
     * 接下来就是为视图添加交互方法，这一部分应当放在控制器中
     * 获取视图元素并为视图中的元素绑定事件交互以及添加动画效果
     */
    MVC.ctrl = function(){
        console.log('MVC.ctrl');
        // 模型数据层对象操作方法引用
        var M = MVC.model;
        // 视图数据层对象操作方法引用
        var V = MVC.view;
        // 控制器创建方法对象
        var C = {
            initSlideBar : function() {
                console.log('inside initSlideBar');
                // 渲染导航栏模块视图
                V('createSlideBar');

                //自定义的按钮
                $('#renderItem').on('click', function(e) {
                    console.log('inside renderItem');
                    C.updateSlideBar();
                });
                $('#addItem').on('click', function(e) {
                    console.log('inside addItem click');
                    var oldData = M.getData('slideBar');
                    oldData.push({
                        text : 'C++',
                        icon : './cpp.png',
                        title: 'C++ Classical',
                        content: 'What is new, What is old',
                        img  : './cpp.png',
                        href : 'http://www.cplusplus.com/doc/tutorial/'
                    });
                    console.log('oldData',oldData);
                    // var newData = oldData;
                    // newData.push({
                    //     text : 'C++',
                    //     icon : './cpp.png',
                    //     title: 'C++ Classical',
                    //     content: 'What is new, What is old',
                    //     img  : './cpp.png',
                    //     href : 'http://www.cplusplus.com/doc/tutorial/'
                    // })
                    // M.setData('slideBar', newData);
                    // console.log('newData', newData);
                    C.updateSlideBar();
                });

                $('li', 'slidebar').on('mouseover', function(e){
                    $(this).addClass('show');
                })
                .on('mouseout', function(e) {
                    $(this).removeClass('show');
                });
                // “收起箭头”图标动画交互
                $('.slidebar-close', 'slidebar')
                .on('click', function(e) {
                    // 如果正在执行动画
                    if(M.getConf('slideBarCloseAnimate')){
                        return false;
                    }
                    // 设置侧边导航模块动画配置数据开关为打开状态
                    M.setConf('slideBarCloseAnimate', true);
                    // 获取当前元素（箭头icon）
                    var $this = $(this);
                    // 如果箭头icon是关闭的状态（含有is-close类）
                    if($this.hasClass('is-close')) {
                        // 为侧边导航模块添加显示动画
                        $('.slidebar-inner', 'slidebar')
                        .animate({
                            duration : 800,
                            type : 'easeOutQuart',
                            main : function(dom) {
                                dom.css('left', -50+this.tween * 50 + 'px');
                            },
                            end : function(){
                                $this.removeClass('is-close');
                                M.setConf('slideBarCloseAnimate', false);
                            }
                        });
                    }
                    // 如果箭头icon是打开的状态
                    else {
                        $('.slidebar-inner', 'slidebar')
                        .animate({
                            duration : 800,
                            type : 'easeOutQuart',
                            main : function(dom) {
                                // 每一帧改变导航模块容器 left 值
                                dom.css('left', this.tween*-50+'px');
                            },
                            end : function(){
                                $this.addClass('is-close');
                                M.setConf('slideBarCloseAnimate', 'false');
                            }
                        })
                    }
                })
            },
            updateSlideBar : function(){
                console.log('inside updateSlideBar');
                C.initSlideBar();
            }
        };
        // 为侧边栏模块添加交互与动画特效
        C.initSlideBar();
    }();
});
