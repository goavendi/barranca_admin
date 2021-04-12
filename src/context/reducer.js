export const initialState = {
	globalNotifications: [],
	user: {}
}

function reducer(state, action) {
	switch (action.type){

		case "SET_CURRENT_USER":
			localStorage.setItem("avendi_user", JSON.stringify(action.data))
			return {...state, user: action.data}

		case "SET_NOTIFICATIONS":
            return { ...state, globalNotifications: action.data }
		default:

		return {...state};

	}
}

export default reducer;