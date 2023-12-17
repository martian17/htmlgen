type Ref<Elem> = {
    prev: Ref<Elem> | null;
    next: Ref<Elem> | null;
    elem: Elem;
};

export class MapList<Elem>{
    objmap = new Map<Elem,Ref<Elem>>;
    head: Ref<Elem> | null = null;
    tail: Ref<Elem> | null = null;
    length = 0;
    get size(){
        return this.objmap.size;
    }
    push_back(elem: Elem){
        if(this.has(elem))this.delete(elem);
        let ref: Ref<Elem> = {
            prev:null,
            next:null,
            elem
        };
        this.objmap.set(elem,ref);
        if(this.tail === null){//empty
            this.head = ref;
            this.tail = ref;
        }else{
            this.tail.next = ref;
            ref.prev = this.tail;
            this.tail = ref;
        }
    }
    pop_back(){
        let tail = this.tail;
        if(tail === null){
            console.log("warning: trying to pop an empty list");
            return undefined;
        }
        this.tail = tail.prev;
        if(this.tail !== null)this.tail.next = null;
        //gj garbage collector
        this.objmap.delete(tail.elem);
        return tail.elem;
    }
    push_front(elem: Elem){
        if(this.has(elem))this.delete(elem);
        console.log("inserting front: ",elem);
        if(this.head === null){
            this.push_back(elem);
        }else{
            this.insertBefore(elem,this.head.elem);
        }
    }
    pop_front(){
        if(this.head === null){
            return undefined;
        }else{
            let h = this.head.elem;
            this.delete(h);
            return h;
        }
    }
    delete(elem: Elem){
        if(!this.objmap.has(elem)){
            console.log("warning: trying to delete an empty element");
            return;
        }
        let ref = this.objmap.get(elem) as Ref<Elem>;
        if(ref.prev === null){//replacing the head
            this.head = ref.next;
        }else{
            ref.prev.next = ref.next;
        }
        if(ref.next === null){
            this.tail = ref.prev;
        }else{
            ref.next.prev = ref.prev;
        }
        this.objmap.delete(elem);
    }
    has(elem: Elem){
        return this.objmap.has(elem);
    }
    getNext(elem: Elem){
        if(!this.objmap.has(elem)){
            throw new Error("Error: trying to get an element that does not exist");
        }
        let ref = this.objmap.get(elem) as Ref<Elem>;
        if(ref.next === null)return undefined;
        return ref.next.elem;
    }
    getPrev(elem: Elem){
        if(!this.objmap.has(elem)){
            throw new Error("Error: trying to get an element that does not exist");
        }
        let ref = this.objmap.get(elem) as Ref<Elem>;
        if(ref.prev === null)return undefined;
        return ref.prev.elem;
    }
    getHead(){
        if(this.head === null){
            return undefined;
        }
        return this.head.elem;
    }
    getTail(){
        if(this.tail === null){
            return undefined;
        }
        return this.tail.elem;
    }
    insertBefore(elem1: Elem, elem2: Elem){//elem1 is the new node
        if(!this.objmap.has(elem2)){
            console.log("warning: trying to insert before a non-member element");
            return;
        }
        if(elem1 === elem2){
            console.log("Warning: trying to insert before itself");
            return;
        }
        if(this.has(elem1))this.delete(elem1);
        let ref2 = this.objmap.get(elem2) as Ref<Elem>;
        let ref1 = {
            prev:ref2.prev,
            next:ref2,
            elem:elem1
        };
        this.objmap.set(elem1,ref1);
        let ref0 = ref2.prev;
        ref2.prev = ref1;
        if(ref0 === null){
            //ref2 used to be the head
            this.head = ref1;
        }else{
            ref0.next = ref1;
        }
    }
    insertAfter(elem1: Elem, elem2: Elem){//elem2 is the new node
        if(!this.objmap.has(elem1)){
            console.log("warning: trying to insert after a non-member element");
            return;
        }
        if(elem1 === elem2){
            console.log("Warning: trying to insert after itself");
            return;
        }
        if(this.has(elem2))this.delete(elem2);
        let ref1 = this.objmap.get(elem1) as Ref<Elem>;
        let ref2 = {
            prev:ref1,
            next:ref1.next,
            elem:elem2
        };
        this.objmap.set(elem2,ref2);
        let ref3 = ref1.next;
        ref1.next = ref2;
        if(ref3 === null){
            //ref1 used to be the tail
            this.tail = ref2;
        }else{
            ref3.prev = ref2;
        }
    }
    foreach(cb: (elem: Elem)=>unknown){
        let ref = this.head;
        while(ref !== null){
            let next = ref.next;//in case ref gets deleted
            cb(ref.elem);
            ref = next;
        }
    }
    clear(){
        this.head = null;
        this.tail = null;
        this.objmap.clear();
    }
    replace(elem: Elem, rep: Elem){
        let ref = this.objmap.get(elem);
        if(!ref){
            throw new Error("element does not exist");
        }
        ref.elem = rep;
        this.objmap.delete(elem);
        this.objmap.set(rep,ref);
        return elem;
    }
    toArray(){
        let arr: Elem[] = [];
        this.foreach((elem)=>{
            arr.push(elem);
        });
        return arr;
    }
    [Symbol.iterator]() {
        let ref = this.head;

        return {
            next: () => {
                if(ref === null)return {done: true};
                let ref0 = ref;
                ref = ref.next;
                return { value: ref0.elem, done: false};
            }
        };
    }
    *loopRange(a?: Elem, b?: Elem){
        if(!a)return;
        if(this.head === null)return;
        let ref : Ref<Elem> | null | undefined = this.objmap.get(a);
        while(ref && ref.elem !== b){
            // @ts-ignore Typescript assumes wrong type
            let next = ref.next;//in case ref gets deleted
            yield ref.elem;
            ref = next;
        }
    }
    loop(){
        return this.loopRange(this.getHead());
    }
    loopUntil(elem: Elem){
        return this.loopRange(this.getHead(),elem);
    }
    loopFrom(elem: Elem){
        return this.loopRange(elem);
    }
    //reverse loops
    *loopReverseRange(a?: Elem, b?: Elem){
        if(!a)return;
        if(this.head === null)return;
        let ref: Ref<Elem> | null | undefined = this.objmap.get(a);
        while(ref && ref.elem !== b){
            // @ts-ignore Typescript assumes wrong type
            let prev = ref.prev;//in case ref gets deleted
            yield ref.elem;
            ref = prev;
        }
    }
    loopReverse(){
        return this.loopReverseRange(this.getTail());
    }
    loopReverseUntil(elem: Elem){
        return this.loopReverseRange(this.getTail(),elem);
    }
    loopReverseFrom(elem: Elem){
        return this.loopReverseRange(elem);
    }
    getNth(n: number){
        if(n >= this.size || n < 0){
            return undefined;
        }
        let ref = this.head;
        for(let i = 0; i < n; i++){
            if(!ref)return;
            ref = ref.next
        }
        if(!ref)return;
        return ref.elem;
    }
    // Aliases
    push(elem: Elem){
        this.push_back(elem);
    }
    pop(){
        this.pop_back();
    }
};



