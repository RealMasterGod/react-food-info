import {createAsyncThunk, createSlice, current} from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    products: [],
    categories: [],
    filteredProducts: []
}

const url = "https://world.openfoodfacts.org/categories.json"

export const getCategoryItems = createAsyncThunk('product/getCategories', async () => {
    try {
        
        const res = await axios.get(url)
        const {tags} = res.data
        return tags
    } catch (err) {
        console.log(err)
    }
}) 

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addMoreProducts: (state,{payload}) => {
            state.products = [...state.products,...payload.products]
        },
        addFilteredProducts: (state,{payload}) => {
            if(payload.fpage === 1)
                state.filteredProducts = [...payload.products]
            else
                state.filteredProducts = [...state.filteredProducts,...payload.products]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCategoryItems.fulfilled, (state,action) => {
            state.categories = action.payload
        })
    }
})

export const {addMoreProducts,addFilteredProducts} = productSlice.actions

export default productSlice.reducer