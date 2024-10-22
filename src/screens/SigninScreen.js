import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SigninScreen=()=> {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signin', {
        email,
        password,
      });
      console.log(data)
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect);
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
            (async()=> {
              try {
                const { data } = await axios.post('/api/users/signin', {
                  email: res.data.email,
                  verified: res.data.verified_email
                  //password: ,
                });
                console.log(data)
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
  }, [navigate, redirect, userInfo, user, email, ctxDispatch]);

  return (
    <Container className="small-container border bg-light">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler} >
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
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">SUBMMIT</Button>
        </div>

        <div className='d-flex justify-content-between border p-2 align-content-center'>
        <Button className="m-2 text-white" variant="secondary" onClick={()=>{
          navigate(`/signup?redirect=${redirect}`)
          }}>
            <strong>REGISTER NEW USER!</strong>
        </Button>
        <Button className="m-2 text-white" variant='success' onClick={login}>
            <strong>LOGIN WITH GOOGLE🚀</strong>
        </Button>
        </div>
        <div className="mb-3">
          Forget Password? <Link to={`/forget-password`}>Reset Password</Link>
        </div>
      </Form>
    </Container>
  );
}


export default SigninScreen