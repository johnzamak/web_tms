import { stat } from "fs";

export function load_stock(inData) {
    return (dispatch) => {
        return dispatch(fetchStock("load_stock_by_id", inData))
    }
}
function fetchStock(check_action, inData) {
    switch (check_action) {
        case "load_stock_by_id":
            return {
                type: 'LOAD_STOCK',
                payload: fetch(`/product_stock/${inData[0].code}`)
                    .then(result => result.json())
            }
    }
}
export function search_product(inData) {
    return (dispatch) => {
        return dispatch(fetchProduct("load_product_by_id", inData))
    }
}
export function add_product(inData) {
    return (dispatch) => {
        return dispatch(fetchProduct("add_product", inData))
    }
}
function fetchProduct(check_action, inData) {
    switch (check_action) {
        case "add_product":
            return {
                type: 'ADD_PRODUCT',
                payload: fetch("/product_master", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(inData)
                }).then(result =>
                    result.json()
                )
            }
        case "load_product_by_sell":
            return {
                type: 'LOAD_PRODUCT_BY_SELL',
                payload: fetch(`/product_master`)
                    .then(result => result.json())
            }
        case "load_product_by_id":
            return {
                type: 'LOAD_PRODUCT_BY_ID',
                payload: fetch(`/product_master/${inData[0].code}`)
                    .then(result => result.json())
            }

    }
}

export function load_product_by_sell() {
    return (dispatch) => {
        return dispatch(fetchProduct("load_product_by_sell", ""))
    }
}

function fetchUsers() {
    return {
        type: 'LOAD_USERS',
        payload: fetch('/users')
            .then(result => result.json())
    }
}

export function loadAlbums(userID) {
    return (dispatch) => {
        return dispatch(fetchAlbums(userID))
    }
}

function fetchAlbums(userID) {
    return {
        type: 'LOAD_ALBUMS',
        payload: fetch(`/albums?userId=${userID}`)
            .then(result => result.json())
    }
}

export function loadPhotos(albumID) {
    return (dispatch) => {
        return dispatch(fetchPhotos(albumID))
    }
}

function fetchPhotos(albumID) {
    return {
        type: 'LOAD_PHOTOS',
        payload: fetch(`/photos?albumId=${albumID}`)
            .then(result => result.json())
    }
}
export function is_loader(status) {
    console.log(status)
    return (dispatch) => {
        switch (status) {
            case false: return dispatch({ type: "IS_LOAD_FALSE" })
            case true: return dispatch({ type: "IS_LOAD_TRUE" })
        }
    }
}
export function alert_box(status,head,msg) {
    console.log(status)
    return (dispatch) => {
        switch (status) {
            case false: return dispatch({ type: "ALERT_BOX_FALSE",head:head,msg:msg })
            case true: return dispatch({ type: "ALERT_BOX_TRUE",head:head,msg:msg })
        }
    }
}