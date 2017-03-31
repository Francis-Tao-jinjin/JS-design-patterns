~(function(window){
    var A = function(selector, context) {
        if(typeof selector == 'function') {
            A(window).on('load', selector);
        } else {
            return new A.fn.init(selector, context);
        }
    }

    A.fn = A.prototype = {
        constructor : A,
        init : function(selector, context) {
            if(typeof selector === 'object') {
                this[0] = selector;
                this.length = 1;
                return this;
            };
            this.length = 0;
            context = document.getElementById(context) || document;
            if(~selector.indexOf('#')) {
                this[0] = document.getElementById(selector.slice(1));
                this.length = 1;
            } else if(~selector.indexOf('.')) {
                let doms = [],
                    className = selector.slice(1);

                if(context.getElementByClassName) {
                    doms = context.getElementByClassName(className);
                } else {
                    doms = context.getElementsByTagName('*');
                }

                for(let i=0, len=doms.length; i<len; i++) {
                    if(doms[i].className && !!~doms[i].className.indexOf(className)) {
                        this[this.length] = doms[i];
                        this.length++;
                    }
                }
            } else {
                let doms = context.getElementsByTagName(selector), 
                    i = 0, len = doms.length;
                for(; i<len;i++) {
                    this[i] = doms[i];
                }
                this.length = len;
            }
            this.context = context;
            this.selector = selector;
            return this;
        },
        length: 0,
        push: [].push,
        splice: [].splice
    }
    A.fn.init.prototype = A.fn;

    A.extend = A.fn.extend = function() {
        var i = 1,
            len = arguments.length,
            target = arguments[0],
            j;
        
        if(i == len) {
            target = this;
            i--;
        }
        for(; i<len; i++) {
            for(j in arguments[i]) {
                target[j] = arguments[i][j];
            }
        }
        return target;
    }

    // 事件绑定方法
    var _on = (function(){
        if(document.addEventListener) {
            return function(dom, type, fn, data) {
                dom.addEventListener(type, function(e){
                    fn.call(dom, e, data);
                }, false);
            }
        }else if(document.attachEvent) {
            return function(dom, type, fn, data) {
                dom.attachEvent('on'+type, function(e){
                    fn.call(dom, e, data);
                })
            }
        } else {
            return function(dom, type, fn, data) {
                dom['on'+type] = function(e) {
                    fn.call(dom, e, data);
                }
            }
        }
    })();
    // 单体对象 A 方法拓展
    A.extend({
        /**
         * 将 'abc-xyz' 式的命名字符串转化为驼峰式 'abcXyz'
         */
        camelCase : function(str) {
            return str.replace(/\-(\w)/g, function(match, letter) {
                return letter.toUpperCase();
            });
        },
        trim : function(str) {
            return str.replace(/^\s+|\s+$/g, '');
        },
        /**
         * @name    创建一个对象并包装成 A 单体对象
         * @param   type    元素类型
         * @param   value   元素属性对象 
         */
        create : function(type, value) {
            var dom = document.createElement(type);
            return A(dom).attr(value);
        },
        /**
         * @name    格式化模板
         * @param   str     模板字符串
         * @param   data    渲染数据
         * eg: '<div>{#value#}</div>' + {value:'test'} -> '<div>test</div>'
         */
         formateString : function(str, data) {
             var html = '';
             // 如果渲染数据是数组，则遍历数组并渲染
             if(data instanceof Array) {
                 for(var i = 0, len = data.length; i < len; i++) {
                     html += arguments.callee(str, data[i]);
                 }
                 return html;
             } else {
                 // 搜索{#key#}格式字符串，并在 data 中查找对应的 key 属性替换
                 return str.replace(/\{#(\w+)#}/g, function(match, key) {
                     return typeof data === 'string' ? data : (typeof data[key] === 'undefined' ? '' : data[key]);
                 });
             }
         }
    });

    A.fn.extend({
        on : function(type, fn, data) {
            var i = this.length;
            for(; --i >= 0;) {
                _on(this[i], type, fn, data);
            }
            return this;
        },
        css : function(){
            var arg = arguments,
            len = arg.length;
            if(this.length < 1) {
                return this;
            }
            if(len === 1) {
                if(typeof arg[0] === 'string') {
                    // ie
                    if(this[0].currentStyle) {
                        return this[0].currentStyle[name];
                    } else {
                        return getComputedStyle(this[0], false)[name];
                    }
                } else if(typeof arg[0] === 'object') {
                    for(let i in arg[0]) {
                        for(let j = this.length - 1; j>=0; j--) {
                            this[j].style[A.camelCase(i)] = arg[0][i];
                        }
                    }
                }
            } else if(len === 2) {
                for(let j = this.length - 1; j>=0; j--) {
                    this[j].style[A.camelCase(arg[0])] = arg[1];
                }
            }
            return this;
        },
        attr : function() {
            var arg = arguments,
                len = arg.length;
            if(this.length < 1) {
                return this;
            }
            if(len === 1) {
                if(typeof arg[0] === 'string') {
                    return this[0].getAttribute(arg[0]);
                } else if(typeof arg[0] === 'object') {
                    console.log('设置属性:', arg);
                    for(let i in arg[0]) {
                        console.log('i is', i);
                        console.log('arg[0][i]', arg[0][i]);
                        for(let j = this.length-1; j>=0; j--) {
                            this[j].setAttribute(i, arg[0][i]);
                        }
                    }
                }
            } else if(len === 2) {
                for(let j = this.length-1; j>=0; j--) {
                    this[j].setAttribute(arg[0], arg[1]);
                }
            }
            return this;
        }, 
        html : function() {
            var arg = arguments,
                len = arg.length;

            console.log('>>>>', arg, this);
            if(this.length<1) {
                return this;
            }
            if(len === 0){
                return this[0].innerHTML;
            } else if(len === 1) {
                for(var i = this.length -1; i>=0; i--) {
                    this[i].innerHTML = arg[0];
                }
            }
            // 如果有两个参数且第二个参数值为 true，则为获取到的所有元素追加内容 
            else if(len === 2 && arg[1]){
                for(let i = this.length-1; i>=0; i--){
                    this[i].innerHTML += arg[0];
                }
            }
            return this;
        },
        hasClass : function(val) {
            // 如果无获取道德元素则返回
            if(!this[0]) {
                return;
            }
            // 类名去除首位空白符
            var value = A.trim(val);
            // 如果获取到的第一个元素类名包含 val 则返回 true，否则返回 false
            return this[0].className && this[0].className.indexOf(value) >= 0 ? true:false;
        },
        addClass : function(val) {
            var value = A.trim(val),
                str = '';

            for(let i=0,len = this.length; i<len; i++) {
                str = this[i].className;
                // 如果元素类名没有包含添加类，则添加
                if(!~str.indexOf(value)) {
                    this[i].className += ' ' + value;
                }
            }
            return this;
        },
        removeClass : function(val) {
            var value = A.trim(val),
                classNameArr,
                result;
            for(let i=0, len=this.length; i<len; i++) {
                if(this[i].className && ~this[i].className.indexOf(value)){
                    classNameArr = this[i].className.split(' ');
                    result = '';

                    for(let j=classNameArr.length-1; j>=0; j--){
                        classNameArr[j] = A.trim(classNameArr[j]);
                        // 如果类名存在并且类名不等于移除类，则保留该类
                        result += (classNameArr[j] && classNameArr[j] != value) ? ''+classNameArr[j] : '';
                    }
                    this[i].className = result;
                }
            }
            return this;
        },
        appendTo : function(parent){
            var doms = A(parent);
            if(doms.length) {
                for(let j = this.length -1; j>=0; j--){
                    // 简化元素克隆(cloneNode)操作，只向第一个父元素中插入子元素
                    console.log('doms[0]', doms[0]);
                    doms[0].appendChild(this[j]);
                }
            }
        }
    });
    
    // 运动框架单体对象
    var Tween = {
        timer : 0,
        queen : [],
        interval : 16,
        easing : {
            // 默认运动缓存算法 匀速运动
            def : function(time, startValue, changeValue, duration) {
                return changeValue*time / duration + startValue
            },
            // 缓慢结束
            easeOutQuart : function(time, startValue, changeValue, duration) {
                return -changeValue*((time=time/duration-1)*time*time*time -1)+startValue;
            }
        },
        /**
         * 添加运动成员
         * @param instance 运动成员
         */
        add : function(instance) {
            this.queen.push(instance);
            this.run();
        },
        /**
         * 停止框架运行
         */
        clear : function(){
            clearInterval(this.timer);
            this.timer = 0;
        },
        /**
         * @name    运行框架
         */
        run : function(){
            // 如果在运行则返回
            if(this.timer){
                return;
            }
            this.clear();
            // 运行框架
            this.timer = setInterval(this.loop, this.interval);
        },
        /**
         * @name    运动框架循环方法
         */
        loop : function(){
            // 如果运动队列中没有成员
            if(Tween.queen.length === 0){
                // 停止框架运行
                Tween.clear();
                return;
            }
            // 获取当前时间
            var now = +new Date();
            // 遍历当前运动成员
            for(let i=Tween.queen.length - 1; i>=0; i--){
                // 获取当前成员
                var instance = Tween.queen[i];
                // 当前成员已运动的时间小鱼当前成员运动时间
                if(instance.passed < instance.duration) {
                    // 执行当前成员主函数
                    Tween.workFn(instance);
                } else {
                    // 结束当前成员运动
                    Tween.endFn(instance);
                }
            }
        },
        /**
         * @name    运行方法
         * @param   instance  运动成员
         */
        workFn : function(instance) {
            // 获取当前成员在当前时刻下的运动进程
            instance.tween = this.easing[instance.type](instance.passed, 
                                                        instance.from,
                                                        instance.to - instance.from,
                                                        instance.duration);
            this.exec(instance);
        },
        /**
         * @name    结束方法
         * @param   instance 运动成员
         */
        endFn : function(instance) {
            instance.passed = instance.duration;
            instance.tween = instance.to;
            this.exec(instance);
            this.distory(instance);
        },
        /**
         * @name    执行主函数
         * @param   instance    运动成员
         */
        exec : function(instance) {
            try {
                // 执行当前成员主函数
                instance.main(instance.dom);
            }catch(e) {}
        },
        /**
         * @name    注销运动成员
         * @param   instance 运动成员
         */
        distory : function(instance){
            // 结束当前成员
            instance.end();
            // 在运动成员队列中删除该成员
            this.queen.splice(this.queen.indexOf(instance), 1);
            // 删除成员中的每一个属性
            for(let i in instance){
                delete instance[i];
            }
        }
    }
    /**
     * @name    获取当前成员在运动成员中的位置
     * @param   instance 运动成员
     */
    Tween.queen.indexOf = function(){
        var that = this;

        return Tween.queen.indexOf || function(instance) {
            for(let i=0,len = that.length; i<len; i++) {
                if(that[i] === instance) {
                    return i;
                }
            }
            return -1;
        }
    }();

    A.fn.extend({
        animate : function(obj) {
            var obj = A.extend({
                duration : 400,
                type : 'def',
                from : 0,
                to : 1,
                start : +new Date(),
                dom : this,
                main : function(){},
                end : function(){}
            }, obj);
            Tween.add(obj);
        }
    })

    window.$ = window.A = A;
})(window);



