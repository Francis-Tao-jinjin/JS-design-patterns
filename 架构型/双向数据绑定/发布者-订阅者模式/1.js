function DataBinder() {
    // Create a simple PubSub object
    var pubSub = {
        callbacks: {},

        on: function (msg, callback) {
            this.callbacks[msg] = this.callbacks[msg] || [];
            this.callbacks[msg].push(callback);
        },

        publish: function (msg) {
            this.callbacks[msg] = this.callbacks[msg] || []
            for (var i = 0, len = this.callbacks[msg].length; i < len; i++) {
                this.callbacks[msg][i].apply(this, arguments);
            }
        },

        show: function () {
            return this.callbacks;
        }
    };
    return pubSub;
}

/**
 * 使用观察者模式做双向绑定的时候有以下几个步骤：
 * 1. 获得一个消息仓库
 * 2. 给数据设置 set 和 get，并在 set 中将消息发布，末尾携带一个参数，该参数指名当前的状态（通常为 this）。
 * 3. 给 DOM 添加 onchange 事件监听，如果触发事件的元素是绑定了目标数据的元素，就发布消息
 * 4. 第一次绑定自定义事件，这次绑定的目的是更新页面上的数据
 * 5. 第二次绑定自定义事件，这次绑定的目的是更新数据模型中的数据（需要通过判断 initiator 是否和 this 一致）
 * @param {*} uid 
 */
function User(uid) {
    var binder = DataBinder(),

        user = {
            attributes: {},

            // The attribute setter publish changes using the DataBinder PubSub
            set: function (attr_name, val) {
                this.attributes[attr_name] = val;
                binder.publish(uid + ":change", attr_name, val, this);
            },

            get: function (attr_name) {
                return this.attributes[attr_name];
            },

            _binder: binder
        };

    var data_attr = "data-bind-" + uid,
        message = uid + ":change",
        changeHandler = function (evt) {
            var target = evt.target,
                prop_name = target.getAttribute(data_attr);

            if (prop_name && prop_name !== "") {
                binder.publish(message, prop_name, target.value);
            }
        };

    // Listen to change events and proxy to PubSub
    document.addEventListener("change", changeHandler, false);

    binder.on(uid + ":change", function (evt, prop_name, new_val) {
        console.log('evt is', evt);
        console.log('inside pubSub.on');

        // 获得所有与该数据绑定的 DOM 元素，更新其中的值
        var elements = document.querySelectorAll("[" + data_attr + "=" + prop_name + "]"),
            tag_name;

        for (var i = 0, len = elements.length; i < len; i++) {
            tag_name = elements[i].tagName.toLowerCase();

            if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
                elements[i].value = new_val;
            } else {
                elements[i].innerHTML = new_val;
            }
        }
    });

    // Subscribe to the PubSub
    binder.on(uid + ":change", function (evt, attr_name, new_val, initiator) {
        console.log('😀 inside binder.on');
        console.log('initiator:', initiator ? JSON.stringify(initiator.attributes) : '');
        console.log('the user :', JSON.stringify(user.attributes));

        if (initiator !== user) {
            user.set(attr_name, new_val);
        }
        console.log('😀 leave binder.on');
    });

    return user;
}

var user = new User(123);
user.set("name", "Wolfgang");

var user = new User('xyz');
user.set("name", "McCland");

