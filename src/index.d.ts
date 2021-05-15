declare class Database {
    constructor(filePath: string);
    fetchDataFromFile(): void;
    saveDataToFile(): void;
    get(key: string): any;
    fetch(key: string): any;
    has(key: string): boolean;
    set(key: string, value: any): void;
    delete(key: string): void;
    sum(key: string, count: number): void;
    sub(key: string, count: number): void;
    push(key: string, element: any): void;
    clear(): void;
}

export = Database;

