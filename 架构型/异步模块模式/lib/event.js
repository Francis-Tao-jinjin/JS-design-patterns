/**
 * 定义 event 模块，但是因为给元素绑定时间要通过 id 获取元素
 * 因此要引用 dom 模块
 */
F.module('lib/event', ['lib/dom'], function(dom) {
    var events = {
        // 绑定事件
        on: function(id, type, fn){
            dom.g(id)['on' + type] = fn;
        }
    }
    return events;
});

