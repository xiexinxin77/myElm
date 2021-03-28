function debounce(func, wait, immediate) {
    let timer;
    return function() {
        let context =this,
            args = arguments;
        clearTimeout(timer)
        if (immediate) {
            let callNow = !timer;
            timer = setTimeout(() => timer = null, wait)
            callNow && func.apply(context, args)
        } else {
            tiemr = setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    }
}