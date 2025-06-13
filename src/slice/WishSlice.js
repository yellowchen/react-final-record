import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlistItems: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")) : []
}

export const wishSlice = createSlice({
    name: "wishlists",
    initialState,
    reducers: {
        addToWishlist (state, action) {
            console.log(action.payload);
            //01 already exist
            //02 new add
            const wishIndex = state.wishlistItems.findIndex(item => item.id === action.payload.id);
            if(wishIndex >= 0) {
                state.wishlistItems = state.wishlistItems;
            }else {
                state.wishlistItems?.push(action.payload);
            }
        },
        removeWishItem (state, action) {
            const filterWishlist = state.wishlistItems.filter(item => item.id !== action.payload.id);
            state.wishlistItems = filterWishlist;
        },
    }
});

export default wishSlice.reducer;
export const { addToWishlist, removeWishItem } = wishSlice.actions;

