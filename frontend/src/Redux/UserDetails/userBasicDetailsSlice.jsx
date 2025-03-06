import {createSlice} from '@reduxjs/toolkit'


export const userBasicDetailsSlice = createSlice(
   {
    name: 'user_basic_details',
    initialState: {
      name: null,
      email:null,
      phone:null,
      profile_pic:null,
      user_type_id:null
    },
    reducers: {
      set_user_basic_details: (state, action) => {
        state.name = action.payload.name;
        state.email=action.payload.email;
        state.phone=action.payload.phone;
        state.profile_pic = action.payload.profile_pic;
        state.user_type_id=action.payload.user_type_id
      }
    }


})

export const {set_user_basic_details} =  userBasicDetailsSlice.actions

export default userBasicDetailsSlice.reducer