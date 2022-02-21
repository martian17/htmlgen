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
        attrs = attrs.map(([an,av])=>[an.trim(),av.trim()]).filter((a)=>{
            if(a[0] === ""){
                return false;
            }
            return true;
        });
        return attrs;
    };


    let getELEM = function(nname,attrs,inner,style){
        if(nname instanceof ELEM){//it's an ELEM
            return nname;
        }else{
            
            return new this.Child_Constructor(nname,attrs,inner,style);
        }
    };



    class ELEM{
        nodeType = 1;
        parent = null;
        //exposing util functions
        static attrParser = attrParser;
        //for internal uses
        Child_Constructor = ELEM;
        attrParser = attrParser;
        getELEM = getELEM;
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
                    this.attrParser(attrs).map((a)=>{
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
                        let child = new this.Child_Constructor(childNodes[i]);
                        if(!child)continue;//child creation failed (unsupported node type)
                        child.parent = this;
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
        setInner(inner){
            //console.log(inner);
            this.children.clear();
            this.e.innerHTML = inner;
            let childNodes = this.e.childNodes;
            for(let i = 0; i < childNodes.length; i++){
                let child = new this.Child_Constructor(childNodes[i]);
                if(!child)continue;//child creation failed (unsupported node type)
                child.parent = this;
                this.children.push(child);
            }
        }
        push_back(){
            let elem = this.getELEM.apply(this,[...arguments]);
            //console.log(elem);
            elem.remove();
            elem.parent = this;
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
            let elem = this.getELEM.apply(this,[...arguments]);
            elem.remove();
            elem.parent = this;
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
        style(str){
            let e = this.e;
            this.attrParser(str).map(([name,val])=>{
                e.style[name] = val;
            });
        }
        remove(){
            if(this.parent){
                this.parent.removeChild(this);//children is a linked list
            }else if(this.e.parentNode){
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
                elem1.remove();
                this.e.insertBefore(elem1.e,elem2.e);
                this.children.insertBefore(elem1,elem2);
                elem1.parent = this;
            }else{//inserting to the siblings
                let parent = this.parent;
                if(!parent){
                    throw new Error("parent to the node not defined");
                }
                elem1 = this.getELEM.apply(this,[...arguments]);
                parent.insertBefore(this,elem1);
            }
        }
        insertAfter(elem1,elem2){
            if(elem2 instanceof ELEM){//insert elem2 to this.children
                let next = this.children.getNext(elem1);
                if(next === null){
                    //just push
                    this.push(elem2);
                }else{
                    this.insertBefore(elem2,next);
                }
            }else{//insert to sibling
                let parent = this.parent;
                if(!parent){
                    throw new Error("parent to the node not defined");
                }
                elem1 = this.getELEM.apply(this,[...arguments]);
                parent.insertAfter(this,elem1);
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
        }
        
        style(str){//setting style
            let pairs = this.attrParser(str);
            let e = this.e;
            pairs.map(([sname,val])=>{
                e.style[sname] = val;
            });
        }
        
        once(evt){
            let that = this;
            let cbs = [];
            //console.log(evt,arguments);
            for(let i = 1; i < arguments.length; i++){
                let cb = arguments[i];
                let evtfunc = function(cb,e){
                    //console.log(cbs,cbs.map);
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
                remove:function(){
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
    };


    //aliases
    ELEM.prototype.add = ELEM.prototype.push_back;
    ELEM.prototype.push = ELEM.prototype.push_back;
    ELEM.prototype.pop = ELEM.prototype.pop_back;

    return ELEM;
})();