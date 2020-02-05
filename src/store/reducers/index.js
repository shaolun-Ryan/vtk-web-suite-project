function submit(state = 4, action){
    switch(action.type){
        case 'submit': 
            return action.value;
        default: 
            return state;
    }
}

export default submit