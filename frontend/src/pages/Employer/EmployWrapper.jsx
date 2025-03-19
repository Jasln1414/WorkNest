import React,{useEffect} from 'react'
import {Routes,Route,useNavigate} from 'react-router-dom'
import EmpHome from './EmployerHome'
import EmployerHeader from './EmployerHeader'
import { useDispatch,useSelector } from 'react-redux';
import isAuthUser from '../../utils/isAuthUser'
import { set_Authentication } from '../../Redux/Authentication/authenticationSlice'
import { set_user_basic_details } from '../../Redux/UserDetails/userBasicDetailsSlice'
import axios from 'axios'
import EmpProfileCreation from './EmployerProfile'
import PostJob from './PostJob'
import EmpProfile from './EmployerProfile';
import EmployerProfileView from './EmpProfileView';
import JobDetail from './job/jobdetail';
import Applications from './job/AppliedJobs';



function EmployerWrapper() {
  const navigate=useNavigate()
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access'); 
  const dispatch =useDispatch()
  const authentication_user = useSelector(state => state.authentication_user);

  const checkAuth = async () =>{
    const isAuthenticated = await isAuthUser();
    if (isAuthenticated.name){
      try{
          const responce = await axios.get(baseURL+'api/account/user/details',{
            headers:{
              'authorization': `Bearer ${token}`,
              'Accept' : 'application/json',
              'Content-Type': 'application/json'
            }
          })
          if(responce.status == 200){
            dispatch(
              set_Authentication({
                name:responce.data.data.full_name,
                email:responce.data.data.email,
                isAuthenticated:true,
                usertype:responce.data.data.usertype,
              })
            )
            dispatch(
              set_user_basic_details({
                profile_pic : responce.data.user_data.profile_pic,
                user_type_id : responce.data.user_data.id,
                
              })
            )
            
          }
      }
      catch(error){
      }
    }
    else{
      navigate('/')
    }
  };


  useEffect(() => {
    
      checkAuth();
    
    
  
  }, [authentication_user])

  return (
    <div>
      <EmployerHeader/>
      <Routes>
       
        <Route path='/EmpHome' element={<EmpHome/>}></Route>
        <Route path='/profile_creation' element={<EmpProfileCreation/>} ></Route>
        <Route path='/profile' element={<EmployerProfileView/>}></Route>
        <Route path='/postjob' element={<PostJob/>}></Route>
        <Route path='/jobdetail/:jobId' element={<JobDetail/>} ></Route>
        <Route path='/applications' element={<Applications/>}></Route>
        
        

      </Routes>
      
      
    </div>
  )
}

export default EmployerWrapper