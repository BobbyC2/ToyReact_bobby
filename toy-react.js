class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    // 设置属性 id class 等  
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    // 添加子元素 会一层层接后
    appendChild(component) {
        this.root.appendChild(component.root);
    }
}
//文本属性
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component);
    }

    get root() {
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
    }
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
    parentElement.appendChild(component.root)
}