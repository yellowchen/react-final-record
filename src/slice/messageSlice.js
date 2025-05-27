import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const initialState = [
	// {
	// 	id: 1,
	// 	type: "success",
	// 	title: "UPDATE",
	// 	text: "UPDATE SUCCESS",
	// }
];

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        createMessage(state, action) {
            console.log("CM: ", action.payload);  
            if(action.payload.success) {
                state.push({
					// id: action.payload.id,
                    id: new Date().getTime(),

					type: "success",
					title: "UPDATE",
					text: action.payload.message,
				});
            }else {
                state.push({
					// id: action.payload.id,
					id: new Date().getTime(),

					type: "danger",
					title: "FAILED",
					text: Array.isArray(action.payload?.message)
						? action.payload?.message.join("、")
						: action.payload?.message,
				});
            }
            
        },
        removeMessage(state, action) {
            console.log(action.payload);
            const index = state.findIndex(item => item === action.payload);
            state.splice(index, 1);
		}
    }
})

//這裡建立的方法，可以被其他元件使用
//createAsyncThunk()中，代入兩個參數
//01 自定義名稱
//02 async function
export const createAsyncMessage = createAsyncThunk(
    "message/createAsyncMessage",
    async (payload, {dispatch}) => {
        //payload是傳遞進來的資料
        console.log("CA: ", payload);
        dispatch(
            messageSlice.actions.createMessage({
                ...payload,
                // id: requestId
            })
        );
        setTimeout(() => {
            dispatch(
                messageSlice.actions.removeMessage(payload.id))
        }, 2000)
    }
)


export default messageSlice.reducer;
export const {createMessage, removeMessage} = messageSlice.actions;

