function cb(val) {
    /* 渲染视图 */
    console.log("视图更新啦～");
}

//设置get和set，属性被访问和修改的时候通知变化
//在get的时候添加观察者，在set的时候触发观察者的更新
function defineReactive(obj, key, val) {
    const dep=new Dep();

    Object.defineProperty(obj, key, {
        enumerable: true,//可枚举
        configurable: true,//可修改或者删除

        get: function reactiveGetter(val) {
            //将当前的watcher对象收集到Dep的subs中
            dep.addSub(Dep.target);
            return val
        },
        set: function reactiveSetter(newVal) {
            if (newVal === val) return;
            //通知所有的watcher来更新视图
            dep.notify();
        }
    })
}

//遍历对象，设置get/set
function observer(value) {
    if (!value || (typeof value !== 'object')) {
        return;
    }

    Object.keys(value).forEach((key) => {
        defineReactive(value, key, value[key]);
    });
}

/**
 * 为什么需要依赖收集
 * 有些数据没有绑定到视图，他改变数据的时候就不应该渲染视图
 * 当一个数据改变的时候，需要让使用到这个数据的实例进行视图更新*/

//订阅者Dep，存放Watcher观察者对象
//在Dep对象的sub中添加watcher的订阅，通知watcher进行更新
class Dep {
    constructor() {
        //用来存放Watcher对象的数组
        this.subs = [];
    }

    //添加watcher对象
    addSub(watcher) {
        this.subs.push(watcher);
    }

    //通知所有watcher对像更新视图
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}

//观察者,更新视图的操作在这里进行
class Watcher {
    constructor() {
        //在new一个Watcher对象的时候，将该对象的值赋给Dep.target，在get中会用到
        Dep.target = this;
    }

    update() {
        console.log('更新视图');
    }
}

Dep.target = null;

/**
 * get时进行依赖收集，Dep对象放入Watcher的实例
 * set调用Dep对象的notify，通知Watcher进行更新
 * render的时候会调用get方法，依赖的对象才会进行读取
 * 在vue的构造函数的时候，就应该将watcher new出来，并将值赋给dep.target
 */

class Vue {
    //vue构造类
    constructor(options) {
        this._data = options.data;//data实际上是一个函数，因为对象的是引用的
        observer(this._data);

        //新建一个Watcher观察者，这时候Dep.target会志翔这个Watcher对象
        new Watcher();
        //模拟render的过程，触发test属性的get函数
        //render function渲染，其中依赖的对象都会被读取
        console.log('render~',this._data.test);
    }
}

module.exports = Vue;