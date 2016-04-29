'use strict';

export function debounce (func: Function , wait: number, context:any) {
    var timeout: number
    var result: any

    let delayedCall = (args) => {
        timeout = null;
        result = func.apply(context, args);
    };

    let debounced = function(any){
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(delayedCall, wait, arguments);
        return result;
    };

    return debounced;
};
