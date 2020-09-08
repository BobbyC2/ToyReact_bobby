const RENDER_TO_DOM = Symbol("render to dom")
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    // 设置属性 id class 等  
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) {

            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
        } else {
            if (name === "className") {
                this.root.setAttribute("class", value);
            } else {
                this.root.setAttribute(name, value);
            }

        }

    }
    // 添加子元素 会一层层接后
    appendChild(component) {
        // this.root.appendChild(component.root);
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
    }
    //重新渲染
    [RENDER_TO_DOM](range) {
        // this.render()._renderToDOM(range)
        range.deleteContents();
        range.insertNode(this.root)
    }
}
//文本属性
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range,) {
        // this.render()._renderToDOM(range)
        range.deleteContents();
        range.insertNode(this.root)
    }
}

//自定义组件
export class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component);
    }
    //私有 _ Symbol 
    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range);
        // range.deleteContent();
        // range.insertNode(this.root)
    }
    rerender() {
        //保存老的range
        let oldRange = this._range
        //特殊处理 保证range不为空 先插入 再去删除 创建新的range插入老的range star位置
        let range = document.createRange();
        range.setStart(oldRange.startContainer, oldRange.startOffset)
        range.setEnd(oldRange.startContainer, oldRange.startOffset)
        this[RENDER_TO_DOM](range)

        oldRange.setStart(range.endContainer,range.endOffset)
        oldRange.deleteContents();
    }
    //进行深拷贝 以递归的形式去访问每一个对象和属性
    setState(newState) {
        if (this.state === null || typeof this.state != "object") {
            this.state = newState;
            this.rerender();
            return;
        }
        //for循环它的所有的子节点 
        let merge = (oldState, newState) => {
            //假设都是对象 两个对象进行合并 for in   ***null的typeof 结果 也是 object 所以需要单独拿出来做判断
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }
        //递归
        merge(this.state, newState)
        this.rerender();
    }
    // get root() {
    //     if (!this._root) {
    //         this._root = this.render().root;
    //     }
    //     return this._root;
    // }
}
// jsx解析语法  递归
export function createElement(type, attributes, ...children) {
    let e;
    //单纯的element 
    if (typeof type === 'string') {
        e = new ElementWrapper(type);
    } else {
        //带标签
        e = new type;
    }
    //type为一个自定义的组件时 
    for (const p in attributes) {
        e.setAttribute(p, attributes[p])
    }
    let insertChildren = (children) => {
        for (const child of children) {
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }
            if (child === null) {
                continue;
            }
            if (typeof child === 'object' && child instanceof Array) {
                insertChildren(child)
            } else {
                e.appendChild(child);
            }
        }
    }
    insertChildren(children);

    return e;
}

// 输出 render 方法
export function render(component, parentElement) {
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}