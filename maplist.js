class MapList{
    constructor(){
        this.objmap = new Map();
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    get size(){
        return this.objmap.size;
    }
    push_back(elem){
        if(this.has(elem))this.delete(elem);
        let ref = {
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
            return false;
        }
        this.tail = tail.prev;
        this.tail.next = null;
        //gj garbage collector
        this.objmap.delete(tail.elem);
        return tail.elem;
    }
    push_front(elem){
        if(this.has(elem))this.delete(elem);
        console.log("inserting front: ",elem);
        if(this.head === null){
            this.push(elem);
        }else{
            this.insertBefore(elem,this.head.elem);
        }
    }
    pop_front(){
        if(this.head === null){
            return null;
        }else{
            let h = this.head.elem;
            this.delete(h);
            return h;
        }
    }
    delete(elem){
        if(!this.objmap.has(elem)){
            console.log("warning: trying to delete an empty element");
            return false;
        }
        let ref = this.objmap.get(elem);
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
    has(elem){
        return this.objmap.has(elem);
    }
    getNext(elem){
        if(!this.objmap.has(elem)){
            throw new Error("Error: trying to get an element that does not exist");
        }
        let ref = this.objmap.get(elem);
        if(ref.next === null)return null;
        return ref.next.elem;
    }
    getPrev(elem){
        if(!this.objmap.has(elem)){
            throw new Error("Error: trying to get an element that does not exist");
        }
        let ref = this.objmap.get(elem);
        if(ref.prev === null)return null;
        return ref.prev.elem;
    }
    getHead(){
        if(this.head === null){
            return null;
        }
        return this.head.elem;
    }
    getTail(){
        if(this.tail === null){
            return null;
        }
        return this.tail.elem;
    }
    insertBefore(elem1,elem2){//elem1 is the new node
        if(!this.objmap.has(elem2)){
            console.log("warning: trying to insert before a non-member element");
            return false;
        }
        if(elem1 === elem2){
            console.log("Warning: trying to insert before itself");
            return false;
        }
        if(this.has(elem1))this.delete(elem1);
        let ref2 = this.objmap.get(elem2);
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
    insertAfter(elem1,elem2){//elem2 is the new node
        if(!this.objmap.has(elem1)){
            console.log("warning: trying to insert after a non-member element");
            return false;
        }
        if(elem1 === elem2){
            console.log("Warning: trying to insert after itself");
            return false;
        }
        if(this.has(elem2))this.delete(elem2);
        let ref1 = this.objmap.get(elem1);
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
    foreach(cb){
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
    replace(elem,rep){
        let ref = this.objmap.get(elem);
        ref.elem = rep;
        this.objmap.delete(elem);
        this.objmap.set(rep,ref);
        return elem;
    }
    toArray(){
        let arr = [];
        this.foreach((elem)=>{
            arr.push(elem);
        });
        return arr;
    }
    *loopRange(a,b){
        let ref = this.objmap.get(a);
        if(this.head === null)return;
        while(ref !== null && ref.elem !== b){
            let next = ref.next;//in case ref gets deleted
            yield ref.elem;
            ref = next;
        }
    }
    loop(){
        return this.loopRange(this.getHead(),null);
    }
    loopUntil(elem){
        return this.loopRange(this.getHead(),elem);
    }
    loopFrom(elem){
        return this.loopRange(elem,null);
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
};


//aliases
MapList.prototype.push = MapList.prototype.push_back;
MapList.prototype.pop = MapList.prototype.pop_back;




//check if node and export module
if(typeof module !== "undefined"){
    module.exports = MapList;
}