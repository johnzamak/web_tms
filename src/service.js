const proxys={
    main:"http://dplus-system.com:3499/",
    develop:"http://localhost:3499/"
}
const public_functions={
    numberFormat(val, fixed) {
        val = parseInt(val)
        fixed = parseInt(fixed)
        if (val <= 0) {
            return 0
        }
        if(isNaN(val)){
            return ""
        }
        if (fixed <= 0) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return val.toFixed(fixed).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    },
    getIndexArray(val, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === val) {
                return i
            }
        }
        return -1
    },
}
module.exports = {
    proxy:proxys,
    public_function:public_functions
}