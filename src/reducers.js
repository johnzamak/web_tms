import { combineReducers } from 'redux'
let global_state = {
    count_index: 0,
    select_product: { count_index: 0 }
}
let order_list = [], count_click = 0

function countAge(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

const initialState = { isRejected: true, data: null, isLoading: false }
function users(state = initialState, action) {
    switch (action.type) {
        case 'LOAD_USERS_PENDING':
            return {
                isRejected: false,
                data: null
            }
        case 'LOAD_USERS_FULFILLED':
            return {
                isRejected: false,
                data: action.payload
            }
        case 'LOAD_USERS_REJECTED':
            return {
                isRejected: true,
                data: null
            }
        default:
            return state
    }
}

function albums(state = initialState, action) {
    switch (action.type) {
        case 'LOAD_ALBUMS_PENDING':
            return {
                isRejected: false,
                data: null
            }
        case 'LOAD_ALBUMS_FULFILLED':
            return {
                isRejected: false,
                data: action.payload
            }
        case 'LOAD_ALBUMS_REJECTED':
            return {
                isRejected: true,
                data: null
            }
        default:
            return state
    }
}

function stock(state = initialState, action) {
    switch (action.type) {
        case 'LOAD_STOCK_PENDING':
            return {
                isRejected: false,
                isLoading: false,
                data: null
            }
        case 'LOAD_STOCK_FULFILLED':
            return {
                isRejected: false,
                isLoading: true,
                data: action.payload
            }
        case 'LOAD_STOCK_REJECTED':
            return {
                isRejected: true,
                isLoading: true,
                data: null
            }
        default:
            return state
    }
}
function select_product(state = global_state, action) {
    let checkItem
    switch (action.type) {
        case "select_product":
            checkItem = order_list.filter(key => key.item_name === action.product_data.name)
            if (checkItem.length > 0) {
                var index = getIndexArray(checkItem[0].item_name, state.data, "item_name")
                var new_data = {
                    item_name: state.data[index].item_name,
                    item_qty: (state.data[index].item_qty + 1),
                    item_price: state.data[index].item_price,
                    total_price: (state.data[index].total_price + state.data[index].item_price),
                }
                order_list.splice(index, 1, new_data)
            } else {
                order_list.push({
                    item_name: action.product_data.name,
                    item_qty: 1,
                    item_price: 100,
                    total_price: 100
                })
            }
            return { ...state, data: order_list }
        case "remove_product":
            checkItem = order_list.filter(key => key.item_name === action.product_data)
            if (checkItem.length > 0) {
                var index = getIndexArray(checkItem[0].item_name, state.data, "item_name")
                var new_data = {
                    item_name: state.data[index].item_name,
                    item_qty: (state.data[index].item_qty - 1),
                    item_price: state.data[index].item_price,
                    total_price: (state.data[index].total_price - state.data[index].item_price),
                }
                if (state.data[index].item_qty - 1 <= 0) {
                    order_list.splice(index, 1)
                } else {
                    order_list.splice(index, 1, new_data)
                }
            }
            return { ...state, data: order_list }
    }
    return state
}
function product(state = initialState, action) {
    console.log("state",state)
    console.log("action", action)
    count_click++
    var check_status = action.type.split("_")
    switch (check_status[check_status.length - 1]) {
        case "PENDING":
            return {
                count_click: count_click,
                isRejected: false,
                isLoading: false,
                step: action.type,
                data: null
            }
        case "FULFILLED":
            return {
                count_click: count_click,
                isRejected: false,
                isLoading: true,
                step: action.type,
                data: action.payload
            }
        case "REJECTED":
            return {
                count_click: count_click,
                isRejected: true,
                isLoading: true,
                step: action.type,
                data: null
            }
        default:
            return {state,count_click}
    }
}
function order_product(state = global_state, action) {
    //    console.log("state",state)
    // console.log("action", action)
    let checkItem
    switch (action.type) {
        case "ORDER_PRODUCT":
            checkItem = order_list.filter(key => key.code === action.data.code)
            if (checkItem.length > 0) {
                var index = getIndexArray(checkItem[0].code, order_list, "code")
                var new_data = {
                    code: order_list[index].code,
                    item_name: order_list[index].item_name,
                    item_qty: (parseInt(order_list[index].item_qty) + parseInt(action.data.product_qty)),
                    item_price: order_list[index].item_price,
                    total_price: (order_list[index].total_price + (action.data.product_price * action.data.product_qty)),
                }
                order_list.splice(index, 1, new_data)
            } else {
                count_click = 0
                order_list.push({
                    code: action.data.code,
                    item_name: action.data.product_name,
                    item_qty: action.data.product_qty,
                    item_price: action.data.product_price,
                    total_price: action.data.product_price * action.data.product_qty,
                })
            }
            count_click++
            return { order_list, count_click }
        case "REMOVE_PRODUCT":
            checkItem = order_list.filter(key => key.code === action.data.code)
            if (checkItem.length > 0) {
                var index = getIndexArray(checkItem[0].code, order_list, "code")
                var new_data = {
                    code: order_list[index].code,
                    item_name: order_list[index].item_name,
                    item_qty: (order_list[index].item_qty - 1),
                    item_price: order_list[index].item_price,
                    total_price: (order_list[index].total_price - order_list[index].item_price),
                }
                if (order_list[index].item_qty - 1 <= 0) {
                    order_list.splice(index, 1)
                } else {
                    order_list.splice(index, 1, new_data)
                }
            }
            count_click++
            return { order_list, count_click }
    }
    return { order_list }
}
function loader(state = initialState, action) {
    switch (action.type) {
        case "IS_LOAD_FALSE": return { isLoader: false }
        case "IS_LOAD_TRUE": return { isLoader: true }
    }
    return state
}
function alert(state = initialState, action) {
    switch (action.type) {
        case "ALERT_BOX_FALSE": return { alertOpen: false,head:action.head,msg:action.msg }
        case "ALERT_BOX_TRUE": return { alertOpen: true,head:action.head,msg:action.msg }
    }
    return state
}
function getIndexArray(val, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === val) {
            return i
        }
    }
    return -1
}
const reducers = combineReducers({
    counter: countAge,
    users,
    albums,
    stock,
    select_product,
    order_product,
    product,
    loader,
    alert
})

export default reducers