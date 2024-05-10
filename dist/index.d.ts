import { MapList } from "./maplist";
import { DOM_Attr, DOM_Text, DOM_CDATASection, DOM_ProcessingInstruction, DOM_Comment, DOM_Document, DOM_DocumentType, DOM_DocumentFragment } from "./interface";
type StyleObject = {
    [key: string]: string;
};
type AttrObject = {
    [key: string]: string;
};
type Callback = (...a: any) => any;
type NodeTypes = HTMLElement | DOM_Attr | DOM_Text | DOM_CDATASection | DOM_ProcessingInstruction | DOM_Comment | DOM_Document | DOM_DocumentType | DOM_DocumentFragment | Node;
type NodeTypeMap<T extends NodeTypes> = T extends HTMLElement ? ELEM : T extends DOM_Attr ? AttributeELEM : T extends DOM_Text ? TextELEM : T extends DOM_CDATASection ? DataSectionELEM : T extends DOM_ProcessingInstruction ? ProcessingInstructionELEM : T extends DOM_Comment ? CommentELEM : T extends DOM_Document ? DocumentELEM : T extends DOM_DocumentType ? DocumentTypeELEM : T extends DOM_DocumentFragment ? DocumentFragmentELEM : BaseELEM;
type Falsy = false | 0 | "" | null | undefined;
export declare class BaseELEM {
    nodeType: number;
    parent: ELEM | null;
    e: Node;
    static fromElement<T extends Node>(e: T): NodeTypeMap<T>;
    remove(): this;
}
export declare class AttributeELEM extends BaseELEM {
    nodeType: number;
    e: DOM_Attr;
}
export declare class TextELEM extends BaseELEM {
    nodeType: number;
    e: DOM_Text;
}
export declare class DataSectionELEM extends BaseELEM {
    nodeType: number;
    e: DOM_CDATASection;
}
export declare class EntityPreferenceELEM extends BaseELEM {
    nodeType: number;
}
export declare class EntityELEM extends BaseELEM {
    nodeType: number;
}
export declare class ProcessingInstructionELEM extends BaseELEM {
    nodeType: number;
    e: DOM_ProcessingInstruction;
}
export declare class CommentELEM extends BaseELEM {
    nodeType: number;
    e: DOM_Comment;
}
export declare class DocumentELEM extends BaseELEM {
    nodeType: number;
    e: DOM_Document;
}
export declare class DocumentTypeELEM extends BaseELEM {
    nodeType: number;
    e: DOM_DocumentType;
}
export declare class DocumentFragmentELEM extends BaseELEM {
    nodeType: number;
    e: DOM_DocumentFragment;
}
export declare class NotationELEM extends BaseELEM {
    nodeType: number;
}
declare class ELEMList extends MapList<BaseELEM> {
    getInstance(e: Node): BaseELEM | undefined;
}
export declare class ELEM extends BaseELEM {
    nodeType: number;
    parent: ELEM | null;
    e: HTMLElement;
    children: ELEMList;
    constructor(nname?: string | Falsy, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy);
    static create(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    setAttrs(attrs: AttrObject): this;
    setStyle(style: StyleObject): this;
    setInner(inner: string): this;
    push_back<T extends BaseELEM>(elem: T): T;
    push_back<T extends Node>(elem: T): NodeTypeMap<T>;
    push_back(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    pop_back(): BaseELEM | undefined;
    push_front<T extends BaseELEM>(elem: T): T;
    push_front<T extends Node>(elem: T): NodeTypeMap<T>;
    push_front(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    pop_front(): BaseELEM | undefined;
    attr(key: string | AttrObject, value: string): this;
    style(key: string | StyleObject, value: string): this;
    removeChild(elem: BaseELEM): this;
    insertBefore<T extends BaseELEM>(newNode: T, reference: BaseELEM): T;
    insertBefore<T extends BaseELEM>(elem: T): T;
    insertBefore<T extends Node>(elem: T): NodeTypeMap<T>;
    insertBefore(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    insertAfter<T extends BaseELEM>(reference: BaseELEM, newNode: T): T;
    insertAfter<T extends BaseELEM>(elem: T): T;
    insertAfter<T extends Node>(elem: T): NodeTypeMap<T>;
    insertAfter(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    replaceChild<T extends BaseELEM>(elem: BaseELEM, rep: T): T;
    replaceInPlace<T extends BaseELEM>(elem: T): T;
    on(evt: string, cb: Callback): Callback;
    off(evt: string, cb: Callback): Callback;
    once(evt: string): {
        remove: () => void;
    };
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    getNext(): BaseELEM | undefined;
    getPrev(): BaseELEM | undefined;
    getDescendent(e: Node): BaseELEM;
    query(query: string): ELEM | undefined;
    queryAll(query: string): ELEM[];
    get rect(): DOMRect;
    get prev(): BaseELEM | undefined;
    get next(): BaseELEM | undefined;
    get head(): BaseELEM | undefined;
    get tail(): BaseELEM | undefined;
    add<T extends BaseELEM>(elem: T): T;
    add<T extends Node>(elem: T): NodeTypeMap<T>;
    add(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    push<T extends BaseELEM>(elem: T): T;
    push<T extends Node>(elem: T): NodeTypeMap<T>;
    push(nname: string, attrs?: AttrObject | Falsy, inner?: string | Falsy, style?: StyleObject | Falsy): ELEM;
    pop(): BaseELEM | undefined;
    class(classname: string): this;
    id(id: string): this;
}
export declare const CSS: {
    css: string;
    add: (str: string) => void;
    init: () => void;
};
export {};
