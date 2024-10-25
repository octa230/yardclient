import React, { useContext, useReducer, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';


const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: ''};
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    case 'CREATE_SHOP':
      return { ...state, loadingShop: true};
    case 'CREATE_SHOP_SUCCESS':
      return {...state, loadingShop: false, seller: action.payload}
    case 'CREATE_SHOP_FAIL':
      return {...state, loadingShop: false, shopError: action.payload}

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 


  const [dispatch] = useReducer(reducer, {
    loadingUpdate: false,
    loadingShop: false
  });


  const deleteHandler = async()=>{
    if(window.confirm('DELEETE THIS ACCOUNT?')){
      try{
        await axios.put('https://api.ugyard.com/api/users/request-deletion', 
        {},{
          headers:{
            Authorization: `Bearer ${userInfo.token}`
          }
        })
        toast.success('ACCOUNT DELETION IN 90 DAYS')
      }catch(error){
        toast.error(error)
      }
    }
  }


  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({type: "UPDATE_REQUEST"})
      const { data } = await axios.put(
        'https://api.ugyard.com/api/users/profile',
        {
          name,
          email, password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      dispatch({type: 'UPDATE_SUCCESS',});
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });

      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };
  

  


  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div className='d-flex justify-content-around'>
      <h1 className="my-3">User Profile</h1>
      <Button size='sm'onClick={deleteHandler}>Delete Account</Button>
      </div>
      <form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <hr/>
        <hr/>



        <div>
          <Button onClick={updateProfileHandler}>update Profile</Button>
        </div>
      </form>
      <hr/>
      <hr/>
    </div>
  );
}
