import * as Yup from 'yup';

export const initialValue = {
    title:"",
    location:"",
    saleryfrom:"",
    saleryto:"",
    applyBefore:"",
    experience:"",
    jobmode:"",
    jobtype:"",
    about:"",
    responsibility:""
}

export const PostJobValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .matches(/^[A-Z]/, 'start with an uppercase letter'),
    location: Yup.string()
        .required('Location is required')
        .matches(/^[a-zA-Z0-9\s,.-]*$/, 'Location can only contain letters, numbers, spaces, commas, periods and hyphens'),
    saleryfrom: Yup.number()
        .required('Salary from is required')
        .positive('Salary from must be greater than 0')
        .integer('Salary from must be a number'),
    saleryto: Yup.number()
        .required('Salary to is required')
        .moreThan(Yup.ref('saleryfrom'), 'Must be greater than Salary from')
        .integer('Salary to must be a number'),
    applyBefore: Yup.date()
        .required('Apply before date is required')
        .min(new Date(), 'Apply before date must be in the future'),
    experience: Yup.string()
        .required('Experience is required'),
    jobmode: Yup.string()
        .required('Job mode is required'),
    jobtype: Yup.string()
        .required('Job type is required'),
    about: Yup.string()
        .required('About is required')
        .min(20, 'About must be at least 20 characters')
        .max(5000, 'About must be less than 500 characters'),
    responsibility: Yup.string()
        .required('Responsibilities are required')
        .min(20, 'Responsibilities must be at least 20 characters')
        .max(5000, 'Responsibilities must be less than 500 characters')
})