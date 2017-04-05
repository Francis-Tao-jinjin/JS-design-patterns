// 创建闭包，作用是封闭已经创建的模块，防止外界对其直接访问
// 向闭包中传入模块管理对象 F（~屏蔽压缩文件时，前面漏写；报错）
~(function(F){
    // 模块缓存器。存储已创建的模块
    var moduleCache = {};
})((function() {
    // 创建模块管理器对象 F, 并保存在全局作用域中
    return window.F = {};
})());

/**
 * 创建或调用模块方法 
 * @param       url         参数为模块 url
 * @param       deps        参数为依赖模块
 * @param       callback    参数为模块主函数
 **/
// 在获取参数的时候是从后往前获取的
F.module = function(url, modDeps, modCallback) {
    // 将参数转化为数组
    var args = [].slice.call(arguments),
        // 获取模块构造函数（参数数组中最后一个参数成员）
        callback = args.pop(),
        // 获取依赖模块（紧邻回调函数参数，且数据类型为数组）
        deps = (args.length && args[args.length-1] instanceof Array) ? args.pop() : [],
        // 该模块 URL（模块ID）
        url = args.length ? args.pop() : null,
        // 依赖模块序列
        params = [],
        // 未加载的依赖模块数量统计
        depsCount = 0,
        // 依赖模块序列中索引值
        i = 0,
        // 依赖模块序列长度
        len;
    // 获取依赖模块长度
    if(len = deps.length) {
        // 遍历依赖模块
        while(i<len) {
            // 闭包保存 i
            (function(i) {
                // 增加依赖模块数量统计
                depsCount++;
                // 异步加载依赖模块
                loadModule(deps[i], function(mod) {
                    // 依赖模块序列中添加依赖模块接口引用
                    params[i] = mod;
                    // 依赖模块加载完成，依赖模块数量统计减一
                    depsCount--;
                    // 如果依赖模块全部加载完
                    if(depsCount === 0) {
                        // 在模块缓存器中矫正该模块，并执行构造函数
                        setModule(url, params, callback);
                    }
                });
            })(i);
            // 遍历下一依赖模块
            i++;
        }
    } 
    // 无依赖模块，直接执行回调函数
    else {
        setModule(url, [], callback);
    }
}

var moduleCache = {},   
    /**
     * 设置模块并执行模块构造函数
     * @param   moduleName      模块 id 名称
     * @param   params          依赖模块
     * @param   callback        模块构造函数
     */
    setModule = function(moduleName, params, callback) {
        // 模块容器，模块文件加载完成回调函数
        var _module, fn;
        // 如果模块被调用过
        if(moduleCache[moduleName]) {
            // 获取模块
            _module = moduleCache[moduleName];
            // 设置模块已加载完成
            _module.status = 'loaded';
            // 矫正模块接口
            _module.exports = callback ? callback.apply(_module, params) : null;
            // 执行模块文件加载完成回调函数
            while(fn = _module.onload.shift()) {
                fn(_module.exports);
            }
        } else {
            // 模块不存在 (匿名模块)，则直接执行构造函数
            callback && callback.apply(null, params);
        }
    },
    /**
     * 异步加载依赖模块所在文件 
     * @param moduleName    模块路径（id）
     * @param callback      模块加载完成灰调函数
     **/
    loadModule = function(moduleName, callback) {
        // 依赖模块
        var _module;
        // 如果依赖模块被要求加载过
        if(moduleCache[moduleName]){
            // 获取该模块信息
            _module = moduleCache[moduleName];
            // 如果模块加载完成
            if(_module.status === 'loaded') {
                // 执行模块加载完成回调函数
                setTimeout(callback(_module.exports), 0);
            } else {
                // 缓存该模块所处文件加载完成回调函数
                _module.onload.push(callback);
            }
        }
        // 模块第一次被依赖引用
        else {
            // 缓存该模块初始化信息
            moduleCache[moduleName] = {
                moduleName : moduleName,    // 模块 id
                status : 'loading',         // 模块对应文件加载状态（默认加载中）
                exports : null,
                onload : [callback]
            };
            // 加载模块对应文件
            loadScript(getUrl(moduleName));
        }
    },
    getUrl = function(moduleName){
        // 拼接完整的文件路径字符串，如 'lib/ajax' => 'lib/ajax.js'
        console.log('moduleName is:',moduleName);
        return String(moduleName).replace(/\.js$/g, '') + '.js';
    },
    loadScript = function(src){
        // 创建 script 元素
        var _script = document.createElement('script');
        _script.type = 'text/JavaScript';
        console.log('src is:',src);
        _script.src = src;
        _script.async = true;       // 异步加载
        _script.charset = 'UTF-8';
        
        // 插入页面中
        document.getElementsByTagName('head')[0].appendChild(_script);
    };




/**
 * 测试异步模块的加载
 */
// 这里其实不应该加 '.js' 后缀，因为如果有的加有的不加，那么 F 中不会认为是同一个模块
// 将会多次加载那个模块，这样的后果不可控，比如以下情况是会导致函数不生效
F.module(['lib/event', 'lib/dom'], function(events, dom){
    events.on('demo', 'click', function(){
        dom.html('demo', 'success');
    })
});