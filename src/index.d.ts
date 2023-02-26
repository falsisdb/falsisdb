declare module 'falsisdb' {
    export class JSONDatabase  {
        constructor(options?: {filePath?: string, backup?: any, time?: number});
        fetchDataFromFile(): void;
        kaydet(key: any, value: any, type: any): void;
        get(key: string): any;
        has(key: string, returnDatas: boolean): boolean;
        set(key: string, value: any): void;
        delete(key: string): void;
        conc(key: string, count: string): void;
        multi(key: string, count: number): void;
        divide(key: string, count: number): void;
        sum(key: string, count: number): void;
        sub(key: string, count: number): void;
        push(key: string, element: any): void;
        includesValue(value: string, returnDatas: boolean): boolean;
        hasValue(value: string, returnDatas: boolean): boolean;
        keys(): void;
        values(): void;
        find(fn: any, thisArg: any): void;
        filter(fn: any, thisArg: any): void;
        filterKey(fn: any, thisArg: any): void;
        info(): void;
        all(): void;
        clear(): void;
    }

    export class YAMLDatabase  {
        constructor(options?: {filePath?: string, backup?: any, time?: number});
        fetchDataFromFile(): void;
        kaydet(key: any, value: any, type: any): void;
        get(key: string): any;
        has(key: string, returnDatas: boolean): boolean;
        set(key: string, value: any): void;
        delete(key: string): void;
        conc(key: string, count: string): void;
        multi(key: string, count: number): void;
        divide(key: string, count: number): void;
        sum(key: string, count: number): void;
        sub(key: string, count: number): void;
        push(key: string, element: any): void;
        includesValue(value: string, returnDatas: boolean): boolean;
        hasValue(value: string, returnDatas: boolean): boolean;
        keys(): void;
        values(): void;
        find(fn: any, thisArg: any): void;
        filter(fn: any, thisArg: any): void;
        filterKey(fn: any, thisArg: any): void;
        info(): void;
        all(): void;
        clear(): void;
    }
}