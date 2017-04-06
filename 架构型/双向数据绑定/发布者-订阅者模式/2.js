function DataBinder(object_id) {
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
        }
    },

        data_attr = "data-bind-" + object_id,
        message = object_id + ":change",

        changeHandler = function (evt) {
            var target = evt.target || evt.srcElement, // IE8 compatibility
                prop_name = target.getAttribute(data_attr);

            if (prop_name && prop_name !== "") {
                pubSub.publish(message, prop_name, target.value);
            }
        };

    // Listen to change events and proxy to PubSub
    if (document.addEventListener) {
        document.addEventListener("change", changeHandler, false);
    } else {
        // IE8 uses attachEvent instead of addEventListener
        document.attachEvent("onchange", changeHandler);
    }
    
    // PubSub propagates changes to all bound elements
    pubSub.on(message, function (evt, prop_name, new_val) {
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

    return pubSub;
}



function User(uid) {
    var binder = new DataBinder(uid),

        user = {
            attributes: {},

            // The attribute setter publish changes using the DataBinder PubSub
            set: function (attr_name, val) {
                this.attributes[attr_name] = val;
                binder.publish( uid + ":change", attr_name, val, this );
            },

            get: function (attr_name) {
                return this.attributes[attr_name];
            },

            _binder: binder
        };

    // Subscribe to the PubSub
    binder.on(uid + ":change", function (evt, attr_name, new_val, initiator) {
        console.log('😀 inside binder.on');
        console.log('initiator:', initiator ? JSON.stringify(initiator.attributes): '');
        console.log('the user :', JSON.stringify(user.attributes));
        
        if (initiator !== user) {
            user.set(attr_name, new_val);
        }
        console.log('😀 leave binder.on');
    });

    return user;
}

var user = new User( 123 );
user.set( "name", "Wolfgang" );