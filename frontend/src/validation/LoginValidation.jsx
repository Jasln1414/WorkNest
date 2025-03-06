import * as Yup from 'yup';

export const initialValues={
    email :"",
    password:""
}

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .matches(/^[\w-\.]+@([\w-]+\.)+com$/, 'Invalid email')
        .required('Required'),
    
    password: Yup.string()
        .min(8,'Password should be minimum 8 charecters')
        .matches(/[A-Z]/,'Password should have atleast one uppercase')
        .matches(/[a-z]/,'Password should have atleast one lowercase')
        .matches(/[0-9]/,'Password should have atleast one number')
        .matches(/[!@#$%^&*]/,'Password should have atleast one special character')
        .required('Required'),
})