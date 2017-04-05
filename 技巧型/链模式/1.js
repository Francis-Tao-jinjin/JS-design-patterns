/**
 * 链模式（Operate of Responsibility）：
 * 通过在对象方法中将当前对象返回，实现对同一个对象
 * 多个方法的链式调用。从而监护对该对象的多个方法的
 * 多次调用时，对该对象的多次引用。
 */

// 原型式继承
var A = function(selector) {
    name    : 'I\'m A';
    // return A.fn.init(selector);
    return new A.fn.init(selector);
}
A.fn = A.prototype = {
    // 强化构造器
    constructor: A,
    init    : function(selector) {
        console.log('this.constructor', this.constructor);

        // 作为当前对象的属性值保存
        this[0] = document.getElementById(selector);
        this.length = 1;    // 矫正 length 对象
        return this;        // 返回当前对象
    },
    length  : 2,
    size    : function() {
        return this.length;
    }
}

A.fn.init.prototype = A.fn;

var demo = A('demo');
console.log(demo);  // Object {0: div#demo, init: function, length:1 ,size:...}
console.log(A('demo').length);

// 由于每次 A 的构造函数返回的 A.fn.init(selector) 对象指向同一个对象
// 所以新创建的 test 会将之前创建的 demo 覆盖掉。
// 解决办法就是将 A.fn.init.prototype = A.fn; 
var test = A('test');
console.log(test, test.length);
console.log(demo, demo.size());








