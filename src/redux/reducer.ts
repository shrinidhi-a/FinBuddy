const initialState = '';

const amtReducer = (state = initialState, action: { type: any; payload: any }) => {
    switch (action.type) {
        case 'UPDATE_STRING':
            return action.payload;
        default:
            return state;
    }
};

export default amtReducer;
