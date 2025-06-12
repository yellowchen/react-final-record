import {configureStore} from "@reduxjs/toolkit";
import  messageReducer from './slice/messageSlice';
import  wishReducer from './slice/WishSlice';


export const store = configureStore({
    reducer: {
        message: messageReducer,
        wishlists: wishReducer
    }
})




export const thousandFormat = (value) => {
	//千分位 方法1
	// if (isNaN(value)) return;
	// return parseInt(value).toLocaleString();

	//千分位 方法2
	if (isNaN(value)) return;
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	return value.toString().replace(regex, ",");
};

//日期格式呈現雙位數
export const addZero = (data) => {
	return data.toString().padStart(2, 0);
	//padStart(要補全的長度,用來捕全的內容);
};
