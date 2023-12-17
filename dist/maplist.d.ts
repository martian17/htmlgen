type Ref<Elem> = {
    prev: Ref<Elem> | null;
    next: Ref<Elem> | null;
    elem: Elem;
};
export declare class MapList<Elem> {
    objmap: Map<Elem, Ref<Elem>>;
    head: Ref<Elem> | null;
    tail: Ref<Elem> | null;
    length: number;
    get size(): number;
    push_back(elem: Elem): void;
    pop_back(): Elem | undefined;
    push_front(elem: Elem): void;
    pop_front(): Elem | undefined;
    delete(elem: Elem): void;
    has(elem: Elem): boolean;
    getNext(elem: Elem): Elem | undefined;
    getPrev(elem: Elem): Elem | undefined;
    getHead(): Elem | undefined;
    getTail(): Elem | undefined;
    insertBefore(elem1: Elem, elem2: Elem): void;
    insertAfter(elem1: Elem, elem2: Elem): void;
    foreach(cb: (elem: Elem) => unknown): void;
    clear(): void;
    replace(elem: Elem, rep: Elem): Elem;
    toArray(): Elem[];
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value?: undefined;
        } | {
            value: Elem;
            done: boolean;
        };
    };
    loopRange(a?: Elem, b?: Elem): Generator<Elem, void, unknown>;
    loop(): Generator<Elem, void, unknown>;
    loopUntil(elem: Elem): Generator<Elem, void, unknown>;
    loopFrom(elem: Elem): Generator<Elem, void, unknown>;
    loopReverseRange(a?: Elem, b?: Elem): Generator<Elem, void, unknown>;
    loopReverse(): Generator<Elem, void, unknown>;
    loopReverseUntil(elem: Elem): Generator<Elem, void, unknown>;
    loopReverseFrom(elem: Elem): Generator<Elem, void, unknown>;
    getNth(n: number): Elem | undefined;
    push(elem: Elem): void;
    pop(): void;
}
export {};
