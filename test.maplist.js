let MapList = require("./maplist.js");

/*
methods

constructor()

push_back(elem)
pop_back()
push_front(elem)
pop_front()
delete(elem)
has(elem)
getNext(elem)
getPrev(elem)
getHead()
getTail()
insertBefore(elem1,elem2)
insertAfter(elem1,elem2)
foreach(cb)
clear()
replace(elem,rep)
toArray()
*/

let main = ()=>{
    let objs = [];
    for(let i = 0; i < 10; i++){
        objs.push({n:i});
    }
    console.log(objs);

    let map = new MapList();

    for(let i = 0; i < objs.length; i++){
        map.push(objs[i]);
    }

    console.log(map.getTail());
    console.log(map.getHead());
    console.log(map.toArray());

    console.log(map.delete(objs[5]));
    console.log(map.toArray());


    map.push(map.getHead());
    console.log(map.toArray());

    console.log(map.pop());
    console.log(map.toArray());


    map.push(map.getHead());
    console.log(map.toArray());
    console.log(map.getHead());
    console.log(map.getTail());

    map.push(objs[6]);
    console.log(map.toArray());

    map.push_front(map.getTail());
    console.log(map.toArray());
    console.log(map.getHead());
    console.log(map.getTail());

    map.insertAfter(objs[7],objs[9]);
    console.log(map.toArray());


    map.insertAfter(objs[7],objs[9]);
    console.log(map.toArray());

    map.insertAfter(objs[9],objs[7]);
    console.log(map.toArray());

    map.insertAfter(objs[8],objs[1]);
    console.log(map.toArray());

    map.insertAfter(objs[1],objs[8]);
    console.log(map.toArray());

    map.insertBefore(objs[8],objs[1]);
    console.log(map.toArray());

    map.insertBefore(objs[1],objs[8]);
    console.log(map.toArray());

    map.clear();
    console.log(map.toArray());
    console.log(map.getHead());
    console.log(map.getTail());


    map.push(objs[8]);
    map.insertBefore(objs[1],objs[8]);
    console.log(map.toArray());

    map.replace(objs[8],objs[3]);
    console.log(map.toArray());
    console.log(map.getNext(map.getHead()));
    console.log(map.getNext(map.getNext(map.getHead())));
    console.log(map.getPrev(map.getNext(map.getHead())));
    console.log(map.has(objs[8]));
    console.log(map.has(objs[1]));


    console.log(map.pop_front());
    console.log(map.toArray());
    console.log(map.getHead());
    console.log(map.getTail());

    console.log(map.objmap);

    console.log(map.pop_front());
    console.log(map.toArray());
    console.log(map.getHead());
    console.log(map.getTail());

    console.log(map.objmap);


};

main();







