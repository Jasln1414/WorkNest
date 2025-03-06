import * as Yup from 'yup';

export const initialValues={
    username:"",
    email:"",
    password:"",
    confirm_password:""
  }

  export const SignupSchema = Yup.object().shape({
    username: Yup.string()
                .min(3,'Too Short!')
                .matches(/^[A-Z][a-zA-Z]/,'First lettershould be capital')
                .max(30,'Too Long!')
                .required('Required'),
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
    confirm_password: Yup.string()
                .oneOf([Yup.ref('password'),null],'Password must match')
                .required('Required')
  });