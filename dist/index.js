import { MapList } from "./maplist";
export class BaseELEM {
    constructor() {
        this.parent = null;
    }
    static fromElement(e) {
        if (this === BaseELEM) {
            let elem;
            switch (e.nodeType) {
                case 1:
                    elem = new ELEM;
                    break;
                case 2:
                    elem = new AttributeELEM;
                    break;
                case 3:
                    elem = new TextELEM;
                    break;
                case 4:
                    elem = new DataSectionELEM;
                    break;
                case 5:
                    elem = new EntityPreferenceELEM;
                    break;
                case 6:
                    elem = new EntityELEM;
                    break;
                case 7:
                    elem = new ProcessingInstructionELEM;
                    break;
                case 8:
                    elem = new CommentELEM;
                    break;
                case 9:
                    elem = new DocumentELEM;
                    break;
                case 10:
                    elem = new DocumentTypeELEM;
                    break;
                case 11:
                    elem = new DocumentFragmentELEM;
                    break;
                case 12:
                    elem = new NotationELEM;
                    break;
                default: throw new Error(`Unknown node type ${e.nodeType}`);
            }
            elem.e = e;
            if (e.nodeType === 1) {
                for (const child of e.childNodes) {
                    elem.children.push(BaseELEM.fromElement(child));
                }
            }
            return elem;
        }
        const elem = new this;
        elem.e = e;
        if (elem instanceof ELEM) {
            for (const child of e.childNodes) {
                elem.children.push(BaseELEM.fromElement(child));
            }
        }
        return elem;
    }
    remove() {
        if (this.parent) {
            this.parent.removeChild(this); //children is a linked list
        }
        else if (this.e.parentNode) {
            console.log("Warning: removing an element through raw dom");
            this.e.parentNode.removeChild(this.e);
        }
        return this;
    }
}
export class AttributeELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 2;
    }
}
export class TextELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 3;
    }
}
export class DataSectionELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 4;
    }
}
export class EntityPreferenceELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 5;
    }
}
export class EntityELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 6;
    }
}
export class ProcessingInstructionELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 7;
    }
}
export class CommentELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 8;
    }
}
export class DocumentELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 9;
    }
}
export class DocumentTypeELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 10;
    }
}
export class DocumentFragmentELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 11;
    }
}
// Never used
export class NotationELEM extends BaseELEM {
    constructor() {
        super(...arguments);
        this.nodeType = 12;
    }
}
export const getELEM = function (nname, attrs, inner, style) {
    if (nname instanceof BaseELEM)
        return nname;
    if (typeof nname === "string")
        return ELEM.create(nname, attrs, inner, style);
    return BaseELEM.fromElement(nname);
};
class ELEMList extends MapList {
    getInstance(e) {
        for (let child of this.loop()) {
            if (child.e === e)
                return child;
        }
        return undefined;
    }
}
export class ELEM extends BaseELEM {
    constructor(nname, attrs, inner, style) {
        super();
        this.nodeType = 1;
        this.parent = null;
        this.children = new ELEMList;
        if (!nname)
            return;
        this.e = document.createElement(nname);
        if (attrs)
            this.setAttrs(attrs);
        if (inner)
            this.setInner(inner);
        if (style)
            this.setStyle(style);
    }
    static create(nname, attrs, inner, style) {
        const elem = new ELEM;
        elem.e = document.createElement(nname);
        if (attrs)
            elem.setAttrs(attrs);
        if (inner)
            elem.setInner(inner);
        if (style)
            elem.setStyle(style);
        return elem;
    }
    setAttrs(attrs) {
        for (let key in attrs) {
            this.e.setAttribute(key, attrs[key]);
        }
    }
    setStyle(style) {
        for (let key in style) {
            // @ts-ignore: style attribute
            this.e.style[key] = style[key];
        }
    }
    setInner(inner) {
        this.children.clear();
        this.e.innerHTML = inner;
        let childNodes = this.e.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let child = BaseELEM.fromElement(childNodes[i]);
            if (!child)
                continue; //child creation failed (unsupported node type)
            child.parent = this;
            this.children.push(child);
        }
        return this;
    }
    push_back(a, b, c, d) {
        const elem = getELEM(a, b, c, d);
        elem.remove();
        elem.parent = this;
        this.children.push(elem);
        this.e.appendChild(elem.e);
        return elem;
    }
    pop_back() {
        let elem = this.children.getTail();
        elem === null || elem === void 0 ? void 0 : elem.remove();
        return elem;
    }
    push_front(a, b, c, d) {
        const elem = getELEM(a, b, c, d);
        elem.remove();
        elem.parent = this;
        this.children.push_front(elem);
        if (this.e.children.length === 0) {
            this.e.appendChild(elem.e);
        }
        else {
            this.e.insertBefore(elem.e, this.e.children[0]);
        }
        return elem;
    }
    pop_front() {
        let elem = this.children.getHead();
        elem === null || elem === void 0 ? void 0 : elem.remove();
        return elem;
    }
    attr(key, value) {
        if (typeof key !== "string") {
            this.setAttrs(key);
            return;
        }
        this.e.setAttribute(key, value);
        return this;
    }
    style(key, value) {
        if (typeof key !== "string") {
            this.setStyle(key);
            return;
        }
        // @ts-ignore: style attribute
        this.e.style[key] = value;
    }
    removeChild(elem) {
        this.children.delete(elem);
        this.e.removeChild(elem.e);
        elem.parent = null;
        return this;
    }
    insertBefore(a, b, c, d) {
        if (b instanceof BaseELEM) {
            const elem1 = a;
            const elem2 = b;
            elem1.remove();
            this.e.insertBefore(elem1.e, elem2.e);
            this.children.insertBefore(elem1, elem2);
            elem1.parent = this;
            return elem1;
        }
        else { //inserting to the siblings
            const parent = this.parent;
            if (!parent) {
                throw new Error("parent to the node not defined");
            }
            const elem1 = getELEM(a, b, c, d);
            parent.insertBefore(elem1, this);
            return elem1;
        }
    }
    insertAfter(a, b, c, d) {
        if (b instanceof BaseELEM) {
            const elem1 = a;
            const elem2 = b;
            let next = this.children.getNext(elem1);
            if (next === undefined) {
                //just push
                return this.push_back(elem2);
            }
            else {
                return this.insertBefore(elem2, next);
            }
        }
        else { //insert to sibling
            let parent = this.parent;
            if (!parent) {
                throw new Error("parent to the node not defined");
            }
            const elem1 = getELEM(a, b, c, d);
            return parent.insertAfter(this, elem1);
        }
    }
    replaceChild(elem, rep) {
        this.insertAfter(elem, rep);
        elem.remove();
        return rep;
    }
    replaceInPlace(elem) {
        if (this.parent) {
            this.parent.replaceChild(this, elem);
        }
        else {
            elem.remove();
            const parent = this.e.parentNode;
            if (!parent)
                return;
            parent.removeChild(this.e);
            parent.appendChild(elem.e);
        }
    }
    on(evt, cb) {
        this.e.addEventListener(evt, cb);
        return cb;
    }
    off(evt, cb) {
        this.e.removeEventListener(evt, cb);
        return cb;
    }
    once(evt) {
        let that = this;
        let cbs = [];
        //console.log(evt,arguments);
        for (let i = 1; i < arguments.length; i++) {
            let cb = arguments[i];
            let evtfunc = function (cb, e) {
                for (let i = 0; i < cbs.length; i++) {
                    that.e.removeEventListener(evt, cbs[i]);
                }
                cbs = [];
                cb(e);
            }.bind(null, cb);
            cbs.push(evtfunc);
            this.e.addEventListener(evt, evtfunc);
        }
        return {
            remove: function () {
                for (let i = 0; i < cbs.length; i++) {
                    that.e.removeEventListener(evt, cbs[i]);
                }
            }
        };
    }
    getX() {
        let e = this.e;
        return e.offsetLeft;
    }
    getY() {
        let e = this.e;
        return e.offsetTop;
    }
    getWidth() {
        let e = this.e;
        return e.offsetWidth;
    }
    getHeight() {
        let e = this.e;
        return e.offsetHeight;
    }
    getNext() {
        if (!this.parent) {
            throw new Error("unsupported operation: parent not registered");
        }
        return this.parent.children.getNext(this);
    }
    getPrev() {
        if (!this.parent) {
            throw new Error("unsupported operation: parent not registered");
        }
        return this.parent.children.getPrev(this);
    }
    getDescendent(e) {
        let chain = [];
        while (e !== this.e) {
            chain.push(e);
            if (e.parentNode) {
                e = e.parentNode;
            }
            else {
                throw new Error("getDescendent: Not a descendent");
            }
        }
        let elem = this;
        while (chain.length !== 0) {
            const e = chain.pop();
            // @ts-ignore: trust me this works
            elem = elem.children.getInstance(e);
        }
        return elem;
    }
    query(query) {
        const e = this.e.querySelector(query);
        if (!e)
            return undefined;
        return this.getDescendent(e);
    }
    queryAll(query) {
        let that = this;
        return [...this.e.querySelectorAll(query)].map(e => that.getDescendent(e));
    }
    get rect() {
        return this.e.getBoundingClientRect();
    }
    get prev() {
        return this.getPrev();
    }
    get next() {
        return this.getNext();
    }
    get head() {
        return this.children.getHead();
    }
    get tail() {
        return this.children.getTail();
    }
    add(a, b, c, d) {
        return this.push_back(a, b, c, d);
    }
    push(a, b, c, d) {
        return this.push_back(a, b, c, d);
    }
    pop() {
        return this.pop_back();
    }
    class(classname) {
        this.e.classList.add(classname);
    }
    id(id) {
        this.attr("id", id);
    }
}
export const CSS = {
    css: "",
    add: function (str) {
        this.css += str;
    },
    init: function () {
        //text/css blob to the head
        let head = getELEM(document.head);
        let blob = new Blob([this.css], { type: "text/css" });
        let link = head.add(getELEM("link", { rel: "stylesheet" }));
        link.attr("href", URL.createObjectURL(blob));
    }
};
