declare module Promise {
    export interface IPromise {
        then(onSuccess: (val: any) => any, onFail?: Function): IPromise;
        resolve(val: any): IPromise;
        reject(val: any): IPromise;
    }

    export interface IDeferred extends IPromise {
        promise: IPromise;
    }

    export function defer(): IDeferred;
    export function resolve(val: any): IPromise;
    export function reject(val: any): IPromise;

    export interface IPromiseBool extends IPromise {
        then(onSuccess: (val: bool) => any, onFail?: Function): IPromise;
    }

    export interface IPromiseString extends IPromise {
        then(onSuccess: (val: string) => any, onFail?: Function): IPromise;
    }

    export interface IPromiseNumber extends IPromise {
        then(onSuccess: (val: number) => any, onFail?: Function): IPromise;
    }

    export interface IPromiseArray extends IPromise {
        then(onSuccess: (val: Array) => any, onFail?: Function): IPromise;
    }
}

/*interface Error {
    stack: any;
}*/