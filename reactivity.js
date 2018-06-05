function cb(val) {
    /* 渲染视图 */
    console.log("视图更新啦～");
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,//可枚举
        configurable: true,//可修改或者删除
        get: function reactiveGetter(val) {
            return val
        },
        set: function reactiveSetter(newVal) {
            if (newVal === val) return;
            cb(newVal);
        }
    })
}

function observer(value) {
    if (!value || (typeof value !== 'object')) {
        return;
    }

    Object.keys(value).forEach((key) => {
        defineReactive(value, key, value[key]);
    });
}

class Vue {
    //vue构造类
    constructor(options) {
        this._data = options.data;//data实际上是一个函数，因为对象的是引用的
        observer(this._data);
    }
}

module.exports=Vue;