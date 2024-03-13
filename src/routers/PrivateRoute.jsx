import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export default function PrivateRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.loginSlice.isLoggedIn);
  const navigate = useNavigate();

  useEffect(()=>{
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  },[isLoggedIn,navigate])
  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
