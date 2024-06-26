import {MapList} from "./maplist";
import {
    DOM_Element,
    DOM_Attr,
    DOM_Text,
    DOM_CDATASection,
    DOM_ProcessingInstruction,
    DOM_Comment,
    DOM_Document,
    DOM_DocumentType,
    DOM_DocumentFragment
} from "./interface";

type StyleObject = {
    [key: string]: string;
}

type AttrObject = {
    [key: string]: string;
}

type Callback = (...a: any) => any;

type NodeTypes = HTMLElement | DOM_Attr | DOM_Text | DOM_CDATASection | DOM_ProcessingInstruction | DOM_Comment | DOM_Document | DOM_DocumentType | DOM_DocumentFragment | Node;

type NodeTypeMap<T extends NodeTypes> = 
    T extends HTMLElement ? ELEM :
    T extends DOM_Attr ? AttributeELEM :
    T extends DOM_Text ? TextELEM :
    T extends DOM_CDATASection ? DataSectionELEM :
    T extends DOM_ProcessingInstruction ? ProcessingInstructionELEM :
    T extends DOM_Comment ? CommentELEM :
    T extends DOM_Document ? DocumentELEM :
    T extends DOM_DocumentType ? DocumentTypeELEM :
    T extends DOM_DocumentFragment ? DocumentFragmentELEM :
    BaseELEM;

type Falsy = false | 0 | "" | null | undefined;

export class BaseELEM{
    nodeType!: number;
    parent: ELEM | null = null;
    e!: Node;
    static fromElement<T extends Node>(e: T): NodeTypeMap<T>{
        if(this === BaseELEM){
            let elem;
            switch(e.nodeType){
                case 1:  elem = new ELEM;break;
                case 2:  elem = new AttributeELEM;break;
                case 3:  elem = new TextELEM;break;
                case 4:  elem = new DataSectionELEM;break;
                case 5:  elem = new EntityPreferenceELEM;break;
                case 6:  elem = new EntityELEM;break;
                case 7:  elem = new ProcessingInstructionELEM;break;
                case 8:  elem = new CommentELEM;break;
                case 9:  elem = new DocumentELEM;break;
                case 10: elem = new DocumentTypeELEM;break;
                case 11: elem = new DocumentFragmentELEM;break;
                case 12: elem = new NotationELEM;break;
                default: throw new Error(`Unknown node type ${e.nodeType}`);
            }
            elem.e = e;
            if(e.nodeType === 1){
                for(const child of e.childNodes){
                    (elem as ELEM).children.push(BaseELEM.fromElement(child));
                }
            }
            // @ts-ignore:
            return elem;
        }
        const elem = new this;
        elem.e = e;
        if(elem instanceof ELEM){
            for(const child of e.childNodes){
                elem.children.push(BaseELEM.fromElement(child));
            }
        }
        // @ts-ignore:
        return elem;
    }
    remove(){
        if(this.parent){
            this.parent.removeChild(this);//children is a linked list
        }else if(this.e.parentNode){
            console.log("Warning: removing an element through raw dom");
            this.e.parentNode.removeChild(this.e);
        }
        return this;
    }
}

export class AttributeELEM extends BaseELEM{
    nodeType = 2;
    e!: DOM_Attr;
}

export class TextELEM extends BaseELEM{
    nodeType = 3;
    e!: DOM_Text;
}

export class DataSectionELEM extends BaseELEM{
    nodeType = 4;
    e!: DOM_CDATASection;
}

export class EntityPreferenceELEM extends BaseELEM{
    nodeType = 5;
}

export class EntityELEM extends BaseELEM{
    nodeType = 6;
}

export class ProcessingInstructionELEM extends BaseELEM{
    nodeType = 7;
    e!: DOM_ProcessingInstruction;
}

export class CommentELEM extends BaseELEM{
    nodeType = 8;
    e!: DOM_Comment;
}

export class DocumentELEM extends BaseELEM{
    nodeType = 9;
    e!: DOM_Document;
}

export class DocumentTypeELEM extends BaseELEM{
    nodeType = 10;
    e!: DOM_DocumentType;
}

export class DocumentFragmentELEM extends BaseELEM{
    nodeType = 11;
    e!: DOM_DocumentFragment;
}

// Never used
export class NotationELEM extends BaseELEM{
    nodeType = 12;
}

function getELEM<T extends BaseELEM>(elem: T): T;
function getELEM<T extends Node>(elem: T): NodeTypeMap<T>;
function getELEM(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
function getELEM(nname: any, attrs?: any, inner?: any, style?: any){
    if(nname instanceof BaseELEM)
        return nname;
    if(typeof nname === "string")
        return ELEM.create(nname,attrs,inner,style);
    return BaseELEM.fromElement(nname);
};

class ELEMList extends MapList<BaseELEM>{
    getInstance(e: Node){
        for(let child of this.loop()){
            if(child.e === e)return child;
        }
        return undefined;
    }
}


export class ELEM extends BaseELEM{
    nodeType = 1;
    parent: ELEM | null = null;
    e!: HTMLElement;
    children = new ELEMList;
    constructor(nname?: string | Falsy, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy){
        super();
        if(!nname)return;
        this.e = document.createElement(nname);
        if(attrs)this.setAttrs(attrs);
        if(inner)this.setInner(inner);
        if(style)this.setStyle(style);
    }
    static create(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy){
        const elem = new ELEM;
        elem.e = document.createElement(nname);
        if(attrs)elem.setAttrs(attrs);
        if(inner)elem.setInner(inner);
        if(style)elem.setStyle(style);
        return elem;
    }
    setAttrs(attrs: AttrObject){
        for(let key in attrs){
            this.e.setAttribute(key,attrs[key]);
        }
        return this;
    }
    setStyle(style: StyleObject){
        for(let key in style){
            // @ts-ignore: style attribute
            this.e.style[key] = style[key];
        }
        return this;
    }
    setInner(inner: string){
        this.children.clear();
        this.e.innerHTML = inner;
        let childNodes = this.e.childNodes;
        for(let i = 0; i < childNodes.length; i++){
            let child = BaseELEM.fromElement(childNodes[i]);
            if(!child)continue;//child creation failed (unsupported node type)
            child.parent = this;
            this.children.push(child);
        }
        return this;
    }
    push_back<T extends BaseELEM>(elem: T): T;
    push_back<T extends Node>(elem: T): NodeTypeMap<T>;
    push_back(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    push_back(a?: any, b?: any, c?: any, d?: any){
        const elem = getELEM(a,b,c,d);
        elem.remove();
        elem.parent = this;
        this.children.push(elem);
        this.e.appendChild(elem.e);
        return elem;
    }
    pop_back(){
        let elem = this.children.getTail();
        elem?.remove();
        return elem;
    }
    push_front<T extends BaseELEM>(elem: T): T;
    push_front<T extends Node>(elem: T): NodeTypeMap<T>;
    push_front(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    push_front(a?: any, b?: any, c?: any, d?: any){
        const elem = getELEM(a,b,c,d);
        elem.remove();
        elem.parent = this;
        this.children.push_front(elem);
        if(this.e.children.length === 0){
            this.e.appendChild(elem.e);
        }else{
            this.e.insertBefore(elem.e,this.e.children[0]);
        }
        return elem;
    }
    pop_front(){
        let elem = this.children.getHead();
        elem?.remove();
        return elem;
    }
    attr(key: string | AttrObject, value: string){
        if(typeof key !== "string"){
            this.setAttrs(key);
            return this;
        }
        this.e.setAttribute(key, value);
        return this;
    }
    style(key: string | StyleObject, value: string){
        if(typeof key !== "string"){
            this.setStyle(key);
            return this;
        }
        // @ts-ignore: style attribute
        this.e.style[key] = value;
        return this;
    }
    removeChild(elem: BaseELEM){
        this.children.delete(elem);
        this.e.removeChild(elem.e);
        elem.parent = null;
        return this;
    }
    insertBefore<T extends BaseELEM>(newNode: T, reference: BaseELEM): T;
    insertBefore<T extends BaseELEM>(elem: T): T;
    insertBefore<T extends Node>(elem: T): NodeTypeMap<T>;
    insertBefore(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    insertBefore(a?: any, b?: any, c?: any, d?: any){
        if(b instanceof BaseELEM){
            const elem1 = a;
            const elem2 = b;
            elem1.remove();
            this.e.insertBefore(elem1.e,elem2.e);
            this.children.insertBefore(elem1,elem2);
            elem1.parent = this;
            return elem1;
        }else{//inserting to the siblings
            const parent = this.parent;
            if(!parent){
                throw new Error("parent to the node not defined");
            }
            const elem1 = getELEM(a,b,c,d);
            parent.insertBefore(elem1,this);
            return elem1;
        }
    }
    insertAfter<T extends BaseELEM>(reference: BaseELEM, newNode: T): T;
    insertAfter<T extends BaseELEM>(elem: T): T;
    insertAfter<T extends Node>(elem: T): NodeTypeMap<T>;
    insertAfter(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    insertAfter(a?: any, b?: any, c?: any, d?: any){
        if(b instanceof BaseELEM){
            const elem1 = a;
            const elem2 = b;
            let next = this.children.getNext(elem1);
            if(next === undefined){
                //just push
                return this.push_back(elem2);
            }else{
                return this.insertBefore(elem2,next);
            }
        }else{//insert to sibling
            let parent = this.parent;
            if(!parent){
                throw new Error("parent to the node not defined");
            }
            const elem1 = getELEM(a,b,c,d);
            return parent.insertAfter(this,elem1);
        }
    }
    replaceChild<T extends BaseELEM>(elem: BaseELEM, rep: T): T{
        this.insertAfter(elem,rep);
        elem.remove();
        return rep;
    }
    replaceInPlace<T extends BaseELEM>(elem: T): T{
        if(this.parent){
            this.parent.replaceChild(this,elem);
        }else{
            elem.remove();
            const parent = this.e.parentNode;
            if(!parent)return elem;
            parent.removeChild(this.e);
            parent.appendChild(elem.e);
        }
        return elem;
    }
    
    on(evt: string, cb: Callback){
        this.e.addEventListener(evt,cb);
        return cb;
    }
    off(evt: string, cb: Callback){
        this.e.removeEventListener(evt,cb);
        return cb;
    }
    
    
    once(evt: string){
        let that = this;
        let cbs: Callback[] = [];
        //console.log(evt,arguments);
        for(let i = 1; i < arguments.length; i++){
            let cb = arguments[i];
            let evtfunc = function(cb: Callback, e: any){
                for(let i = 0; i < cbs.length; i++){
                    that.e.removeEventListener(evt,cbs[i]);
                }
                cbs = [];
                cb(e);
            }.bind(null,cb);
            cbs.push(evtfunc);
            this.e.addEventListener(evt,evtfunc);
        }
        return {
            remove: function(){
                for(let i = 0; i < cbs.length; i++){
                    that.e.removeEventListener(evt,cbs[i]);
                }
            }
        };
    }
    
    getX(){
        let e = this.e;
        return e.offsetLeft;
    }
    getY(){
        let e = this.e;
        return e.offsetTop;
    }
    getWidth(){
        let e = this.e;
        return e.offsetWidth;
    }
    getHeight(){
        let e = this.e;
        return e.offsetHeight;
    }
    getNext(){
        if(!this.parent){
            throw new Error("unsupported operation: parent not registered");
        }
        return this.parent.children.getNext(this);
    }
    getPrev(){
        if(!this.parent){
            throw new Error("unsupported operation: parent not registered");
        }
        return this.parent.children.getPrev(this);
    }
    getDescendent(e: Node){
        let chain: Node[] = [];
        while(e !== this.e){
            chain.push(e);
            if(e.parentNode){
                e = e.parentNode;
            }else{
                throw new Error("getDescendent: Not a descendent");
            }
        }
        let elem = this;
        while(chain.length !== 0){
            const e = chain.pop();
            // @ts-ignore: trust me this works
            elem = elem.children.getInstance(e);
        }
        return elem as BaseELEM;
    }
    query(query: string){
        const e = this.e.querySelector(query);
        if(!e)return undefined;
        return this.getDescendent(e) as ELEM;
    }
    queryAll(query: string){
        let that = this;
        return [...this.e.querySelectorAll(query)].map(e=>
        that.getDescendent(e)) as ELEM[];
    }
    get rect(){
        return this.e.getBoundingClientRect();
    }
    get prev(){
        return this.getPrev();
    }
    get next(){
        return this.getNext();
    }
    get head(){
        return this.children.getHead();
    }
    get tail(){
        return this.children.getTail();
    }

    // aliases
    add<T extends BaseELEM>(elem: T): T;
    add<T extends Node>(elem: T): NodeTypeMap<T>;
    add(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    add(a?: any, b?: any, c?: any, d?: any){
        return this.push_back(a,b,c,d);
    }
    push<T extends BaseELEM>(elem: T): T;
    push<T extends Node>(elem: T): NodeTypeMap<T>;
    push(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    push(a?: any, b?: any, c?: any, d?: any){
        return this.push_back(a,b,c,d);
    }
    pop(){
        return this.pop_back();        
    }
    class(classname: string){
        this.e.classList.add(classname);
        return this;
    }
    id(id: string){
        this.attr("id",id);
        return this;
    }
}

export const CSS = {
    css:"",
    add:function(str: string){
        this.css += str;
    },
    init:function(){
        //text/css blob to the head
        let head = getELEM(document.head) as ELEM;
        let blob = new Blob([this.css],{type:"text/css"});
        let link = head.add(getELEM("link",{rel:"stylesheet"})) as ELEM;
        link.attr("href",URL.createObjectURL(blob));
    }
};


