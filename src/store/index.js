import { createStore } from 'redux'
import reducer from './reducers'
const store = createStore(reducer)

store.subscribe(()=>{
    console.log('收到更新', store.getState())
})

export default store