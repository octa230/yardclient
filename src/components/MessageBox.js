import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
  return <Alert variant={props.variant || 'info'} className='h-25 align-self-center my-1'>{props.children}</Alert>;
}
