import {configureStore} from '@reduxjs/toolkit'
import authenticationSliceReducer from './Authentication/authenticationSlice'
import userBasicDetailsSliceReducer from './UserDetails/userBasicDetailsSlice'



export default configureStore({
    reducer:{
        authentication_user:authenticationSliceReducer,
        user_basic_details:userBasicDetailsSliceReducer,
       
    }
})