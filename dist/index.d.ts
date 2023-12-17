import { MapList } from "./maplist";
import { DOM_Attr, DOM_Text, DOM_CDATASection, DOM_ProcessingInstruction, DOM_Comment, DOM_Document, DOM_DocumentType, DOM_DocumentFragment } from "./interface";
type StyleObject = {
    [key: string]: string;
};
type AttrObject = {
    [key: string]: string;
};
type Callback = (...a: any) => any;
export declare class BaseELEM {
    nodeType: number;
    parent: ELEM | null;
    e: Node;
    static fromElement(e: Node): BaseELEM;
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
export declare const getELEM: (nname: string | BaseELEM | Node, attrs?: AttrObject, inner?: string, style?: StyleObject) => BaseELEM;
declare class ELEMList extends MapList<BaseELEM> {
    getInstance(e: Node): BaseELEM | undefined;
}
export declare class ELEM extends BaseELEM {
    nodeType: number;
    parent: ELEM | null;
    e: HTMLElement;
    children: ELEMList;
    static create(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): ELEM;
    setAttrs(attrs: AttrObject): void;
    setStyle(style: StyleObject): void;
    setInner(inner: string): this;
    push_back(elem: BaseELEM): BaseELEM;
    push_back(e: Node): BaseELEM;
    push_back(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    pop_back(): BaseELEM | undefined;
    push_front(elem: BaseELEM): BaseELEM;
    push_front(e: Node): BaseELEM;
    push_front(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    pop_front(): BaseELEM | undefined;
    attr(key: string | AttrObject, value: string): this | undefined;
    style(key: string | StyleObject, value: string): void;
    removeChild(elem: BaseELEM): this;
    insertBefore(elem1: BaseELEM, elem2: BaseELEM): BaseELEM;
    insertBefore(elem: BaseELEM): BaseELEM;
    insertBefore(e: Node): BaseELEM;
    insertBefore(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    insertAfter(elem1: BaseELEM, elem2: BaseELEM): BaseELEM;
    insertAfter(elem: BaseELEM): BaseELEM;
    insertAfter(e: Node): BaseELEM;
    insertAfter(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    replaceChild(elem: BaseELEM, rep: BaseELEM): BaseELEM;
    replaceInPlace(elem: BaseELEM): void;
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
    query(query: string): BaseELEM | undefined;
    queryAll(query: string): BaseELEM[];
    get rect(): DOMRect;
    get prev(): BaseELEM | undefined;
    get next(): BaseELEM | undefined;
    get head(): BaseELEM | undefined;
    get tail(): BaseELEM | undefined;
    add(elem: BaseELEM): BaseELEM;
    add(e: Node): BaseELEM;
    add(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    push(elem: BaseELEM): BaseELEM;
    push(e: Node): BaseELEM;
    push(nname: string, attrs?: AttrObject, inner?: string, style?: StyleObject): BaseELEM;
    pop(): BaseELEM | undefined;
}
export declare const CSS: {
    css: string;
    add: (str: string) => void;
    init: () => void;
};
export {};
