function throttle (func, wait) {
    let timer = null;
    let old = 0;
    return function() {
        let context = this;
        let args = arguments;
        if (Date.now() - old > wait) {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            old = Date.now()
            func.apply(context, args)
        } else if (!timer) {
            timer = setTimeout(() => {
                old = Date.now()
                timer = null
                func.apply(context, args)
            }, wait);
        }
    }
}