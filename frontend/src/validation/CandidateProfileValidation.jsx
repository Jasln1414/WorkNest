import * as Yup from 'yup';

export const initialValues = {
    username:"",
    phone:"",
    place:"",
    dob:"",
    gender:"",
    education:"",
    specilization:"",
    college:"",
    completed:"",
    mark:"",
    linkedin:"",
    github:"",
    // resume:null
}

export const ProfileDataSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^[1-9]\d{9}$/, 'Phone number must be exactly 10 digits and should not start with 0')
        .required('Phone number is required'),
     place: Yup.string()
        .matches(/^[^\d]+$/, 'Place should not contain numbers')
        .required('Place is required'),
    dob: Yup.string()
        .required('Date of birth is required'),
    gender: Yup.string()
        .required('Gender is required'),
    education: Yup.string()
        .matches(/^[^\d]+$/, 'Education should not contain numbers')
        .required('Education is required'),
    specilization: Yup.string()
        .matches(/^[^\d]+$/, 'Specialization should not contain numbers')
        .required('Specialization is required'),
    college: Yup.string()
        .matches(/^[^\d]+$/, 'College should not contain numbers')
        .required('College is required'),
    completed: Yup.string()
        .required('Completion status is required'),
    mark: Yup.string()
        .matches(/^\d{1,2}$/, 'Marks should be a number between 1 and 99')
        .required('Marks are required'),
    linkedin: Yup.string()
        .url('LinkedIn profile must be a valid URL format'),
    github: Yup.string()
        .url('GitHub profile must be a valid URL format'),
    
})

export const ProfileEditSchema = Yup.object().shape({
    username: Yup.string()
        .min(3,'Too Short!')
        .matches(/^[A-Z][a-zA-Z]/,'First lettershould be capital')
        .max(30,'Too Long!'),
    email: Yup.string()
        .email('Invalid email')
        .matches(/^[\w-\.]+@([\w-]+\.)+com$/, 'Invalid email'),
    place: Yup.string()
        .matches(/^[^\d]+$/, 'Place should not contain numbers'),
    phone: Yup.string()
        .matches(/^[1-9]\d{9}$/, 'Phone number must be exactly 10 digits and should not start with 0'),
        
})

export const EducationSchema = Yup.object().shape({
    education: Yup.string()
        .matches(/^[^\d]+$/, 'Education should not contain numbers')
        .required('Education is required'),
    specilization: Yup.string()
        .matches(/^[^\d]+$/, 'Specialization should not contain numbers')
        .required('Specialization is required'),
    college: Yup.string()
        .matches(/^[^\d]+$/, 'College should not contain numbers')
        .required('College is required'),
    completed: Yup.string()
        .required('Completion status is required'),
    mark: Yup.string()
        .matches(/^\d{1,2}$/, 'Marks should be a number between 1 and 99')
        .required('Marks are required'),
})