import {createContext} from "react";

//01 useContext建立 (for 跨元件傳遞)
export const MessageContext = createContext({});


//02 Reducer - state   
export const initState = {
    type: "",
    title: "",
    text: "",
}

//02 Reducer - action type
export const messageReducer = (state, action) => {
	// const xxxReducer = (state, action) => {};
	switch (action.type) {
		case "POST_MESSAGE":
			return {
				...action.payload
			};

		case "CLEAR_MESSAGE":
			return {
				...initState,
			};
		default:
			return state;
	}
}


export function handleSuccessMessage(dispatch, res) {
	dispatch({
		type: "POST_MESSAGE",
		payload: {
			type: "success",
			title: "更新成功",
			text: res.data.message,
		},
	});
	setTime(dispatch);
}


export function handleErrorMessage(dispatch, err) {
	dispatch({
		type: "POST_MESSAGE",
		payload: {
			type: "danger",
			title: "更新失敗",
            //這邊的text結果可能是單個錯誤訊息(string)或是多個錯誤訊息(陣列)，因此要加入isArray判斷
			text: Array.isArray(err?.response?.data?.message)
				? err?.response?.data?.message.join(" ")
				: err?.response?.data?.message,
		},
	});
	setTime(dispatch);
}

export function deleteSuccessMessage(dispatch, res) {
	dispatch({
		type: "POST_MESSAGE",
		payload: {
			type: "success",
			title: "刪除成功",
			text: res.data.message,
		},
	});
	setTime(dispatch);
}


function setTime(dispatch) {
	setTimeout(() => {
		dispatch({
			type: "CLEAR_MESSAGE",
		});
	}, 3000);
}

