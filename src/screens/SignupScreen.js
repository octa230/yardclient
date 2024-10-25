import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('')
  const [user, setUser] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;




  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('https://api.ugyard.com/api/users/signup', {
        name,
        email,
        phone,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };



  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });



  useEffect(() => {

    const googleSignInUser = ()=>{     
      if(user){
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers:{
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        }).then((res)=> {
          if(res.data.email){
            //console.log(res.data)
            (async()=> {
              try {
                const { data } = await Axios.post('/api/users/signup', {
                  name: res.data.name,
                  email: res.data.email,
                  verified: res.data.verified_email
                });
                ctxDispatch({ type: 'USER_SIGNIN', payload: data });
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate(redirect || '/');
              } catch (err) {
                toast.error(getError(err));
              }
            })()
          }
        }).catch((error)=> {
          toast.error(error)
        })
      }
    }
    if (userInfo) {
      navigate(redirect);
    }
    googleSignInUser()
  }, [navigate, redirect, userInfo, user, email]);

  return (
    <Container className="small-container bg-light border">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name" type="text">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="tel">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="telephone"
            onChange={(e) => setPhone(e.target.value)}
          />
          </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className='d-flex justify-content-between border p-2 align-content-center'>
       
        <Button type="submit">SUBMMIT</Button>

        <button className="m-2 text-white bg-primary p-2 border border-none rounded" onClick={login}>
            <strong>SIGN UP WITH GOOGLE🚀</strong>
        </button>
        </div>
        <Button className="my-3 text-white w-100" variant='warning' onClick={()=>{
          navigate(`/signin?redirect=${redirect}`)
          }}>
          <strong>GO TO LOGIN...</strong>
        </Button> 
      </Form>

    </Container>
  );
}
