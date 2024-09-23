import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    cart: [],
    quantity: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state,action) => {
            state.cart = [...state.cart,action.payload.product]
            state.quantity = state.quantity + 1
        },
        removeFromCart: (state,action) => {
            state.cart = state.cart?.filter(item => {
                if(item?.code !== action.payload.code && item?.product_name !== action.payload?.name) {
                    return item
                }
            })
            if(state.quantity !== 0)
                state.quantity = state.quantity - 1
        }
    }
})

export const {addToCart,removeFromCart} = cartSlice.actions

export default cartSlice.reducer