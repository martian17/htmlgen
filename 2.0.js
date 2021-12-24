let ELEM = (()=>{
    let attrParser = function(str){
        //escape ":" and ";"
        let attrs = [["",""]];
        let mode = 0;
        for(let i = 0; i < str.length; i++){
            let attr = attrs.pop();
            let char = str[i];
            if(char === "_"){//escape character
                attr[mode] += str[i+1];
                i++;
                attrs.push(attr);
            }else if(char === ":"){
                mode++;
                attrs.push(attr);
            }else if(char === ";"){
                mode = 0;
                attrs.push(attr);
                attrs.push(["",""]);
            }else{
                attr[mode] += str[i];
                attrs.push(attr);
            }
        }
        attrs = attrs.filter((a)=>{
            if(a[0] === ""){
                return false;
            }
            return true;
        });
        return attrs;
    };


    let getELEM = function(nname,attrs,inner,style){
        if(nname.constructor === ELEM){//it's an ELEM
            return nname;
        }else{
            return new ELEM(nname,attrs,inner,style);
        }
    };



    class ELEM{
        nodeType = 1;
        parent = null;
        constructor(nname,attrs,inner,style){
            this.children = new MapList();
            if(nname === "text"){
                this.e = document.createTextNode(attrs);
                this.nodeType = 3;//text node
                return;
            }else if(typeof nname === "string"){
                if(nname[0].match(/[a-z]/)){//is elem name
                    this.e = document.createElement(nname);
                }else{
                    this.e = document.querySelector(nname);
                }
                let e = this.e;
                if(attrs){
                    attrParser(attrs).map((a)=>{
                        e.setAttribute(a[0],a[1]);
                    });
                }
                if(inner){
                    this.setInner(inner);
                }
                if(style){
                    e.style = style;
                }
                this.e = e;
            //}else if(return element instanceof Element || element instanceof HTMLDocument){//if html element
            }else if(nname instanceof Node){
                if(nname.nodeType === 1){
                    this.e = nname;
                    let childNodes = nname.childNodes;
                    for(let i = 0; i < childNodes.length; i++){
                        let child = new ELEM(childNodes[i]);
                        if(!child)continue;//child creation failed (unsupported node type)
                        child.setParent(this);
                        this.children.push(child);
                    }
                }else if(nname.nodeType === 3){//text
                    this.e = nname;
                    this.nodeType = 3;
                }else{
                    return false;
                }
            }else{
                throw new Error("Unexpected input type "+nname);
            }

            /*
            //children getter/setter
            Object.defineProperties(this, {
                "children": {
                     "get": ()=>that.e.children,
                     "set": ()=>{}
                }
            });
            */
        }
        setParent(paren){
            this.remove();
            this.parent = parent;
        }
        setInner(inner){
            this.children.clear();
            this.e.innerHTML = inner;
            let childNodes = this.e.childNodes;
            for(let i = 0; i < childNodes.length; i++){
                let child = new ELEM(childNodes[i]);
                if(!child)continue;//child creation failed (unsupported node type)
                child.setParent(this);
                this.children.push(child);
            }
        }
        push_back(){
            let elem = getELEM.apply(null,[...arguments]);
            elem.setParent(this);
            this.children.push(elem);
            this.e.appendChild(elem.e);
            return elem;
        }
        pop_back(){
            let elem = this.children.getTail();
            elem.remove();
            return elem;
        }
        push_front(){
            let elem = getELEM.apply(null,[...arguments]);
            elem.setParent(this);
            this.children.push(elem);
            this.e.appendChild(elem.e);
            return elem;
        }
        pop_front(){
            let elem = this.children.getHead();
            elem.remove();
            return elem;
        }
        attr(a,b){
            this.e.setAttribute(a,b);
        }
        remove(){
            if(this.parent){
                this.parent.removeChild(this);//children is a linked list
            }else{
                console.log("Warning: removing an element through raw dom");
                this.e.parentNode.removeChild(this.e);
            }
        }
        removeChild(elem){
            this.children.delete(elem);
            this.e.removeChild(elem.e);
            elem.parent = null;
        }
        insertBefore(elem1,elem2){
            if(elem2 instanceof ELEM){//inserting to the child
                this.e.insertBefore(elem1.e,elem2.e);
                this.children.insertBefore(elem1,elem2);
                elem1.setParent(this);
            }else{//inserting to the siblings
                let parent = this.parent;
                if(!parent){
                    throw new Error("parent to the node not defined");
                }
                elem1 = getELEM.apply(null,[...arguments]);
                parent.insertBefore(this,elem1);
            }
        }
        insertAfter(elem1,elem2){
            if(elem2 instanceof ELEM){//insert elem2 to this.children
                let next = this.children.getNext(elem1);
                if(next === null){
                    //just push
                    this.children.push(elem2);
                    this.e.appendChild(elem2.e);
                }else{
                    this.e.insertBefore(elem2.e,next.e);
                    this.children.insertBefore(elem2,next);
                }
                elem2.setParent(this);
            }else{//insert to sibling
                let parent = this.parent;
                if(!parent){
                    throw new Error("parent to the node not defined");
                }
                elem1 = getELEM.apply(null,[...arguments]);
                parent.insertAfter(elem1,this);
            }
        }
        replace(elem,rep){
            this.insertAfter(elem,rep);
            elem.remove();
        }
        on(evt){
            let that = this;
            let cbs = [];
            for(let i = 1; i < arguments.length; i++){
                let cb = arguments[i];
                cbs.push(cb);
                this.e.addEventListener(evt,cb);
            }
            return {
                remove:function(){
                    for(let i = 0; i < cbs.length; i++){
                        that.e.removeEventListener(evt,cbs[i]);
                    }
                }
            };
        };
    };


    //aliases
    ELEM.prototype.add = ELEM.prototype.push_back;

    return ELEM;
})();