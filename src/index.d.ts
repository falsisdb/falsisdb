declare class falsisdb {
    constructor(filePath: string);
    fetchDataFromFile(): void;
    kaydet(): void;
    on(event: string, type: string, status: string, code: string): void;
    get(key: string): any;
    fetch(key: string): any;
    has(key: string): boolean;
    set(key: string, value: any): void;
    delete(key: string): void;
    conc(key: string, count: string); any;
    multi(key: string, count: number): void;
    divide(key: string, count: number): void;
    sum(key: string, count: number): void;
    sub(key: string, count: number): void;
    push(key: string, element: any): void;
    sqrt(sayi: number): any;
    math(key: number, islem: any, key2: number): any;
    includes(key: any);
    all(): void;
    clear(): void;
}

export = falsisdb;

