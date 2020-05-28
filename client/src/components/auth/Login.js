import React, {Fragment,useState} from 'react';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'; 
import {login} from '../../action/auth';

const Login = ({login,isAuthenticated}) => {
  const[formData,setFormData]=useState({
    email:'',
    password:''
  });
  const {email,password}=formData;
  const onChange= e =>setFormData({...formData,[e.target.name]:e.target.value})
  const onSubmit = async e =>{
    e.preventDefault();
   login(email,password);
    };
    //redirect if logged in
    if(isAuthenticated){
      return <Redirect to='/dashboard' />
    }
  return (
   <Fragment>
   <h1 className="large text-primary">Log In</h1>
   <p className="lead"><i className="fas fa-user"></i> Login  Your Account</p>
   <form className="form" onSubmit={e => onSubmit(e)}>

     <div className="form-group">
       <input type="email" placeholder="Email Address" name="email" value={email}  onChange={e => onChange(e)} required/>
     </div>
     <div className="form-group">
       <input
         type="password"
         placeholder="Password"
         name="password"
         minLength="6"
         value={password}
         onChange={e => onChange(e)}
       />
     </div>
     
     <input type="submit" className="btn btn-primary" value="Log In" />
   </form>
   <p className="my-1">
     Don't  have an account? <Link to="/register">Sign UP</Link>
   </p>
   </Fragment>
   );
 }
 const mapStateToProps= state =>({
   isAuthenticated:state.auth.isAuthenticated
 })

 Login.propTypes ={
   login:PropTypes.func.isRequired,
   isAuthenticated:PropTypes.bool
 }



export default  connect(mapStateToProps, {login}) (Login);
