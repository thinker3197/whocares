const initialState = {
    web3: undefined
};

export default (state=initialState,action) => {
    switch(action.type) {
        case "SET_WEB3":
            return Object.assign({},state,{
                web3: action.payload
            });
        default:
            return initialState;
    }
}