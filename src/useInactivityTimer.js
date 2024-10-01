import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

const useInactivityTimer = (timeout = 900000) => { //900000
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('data');
      window.location.href = '/login';
    }, timeout);
  };

  useEffect(() => {
    resetTimer(); 

    const throttledMouseMove = throttle(() => resetTimer(), 1000);
    const throttledScroll = throttle(() => resetTimer(), 1000); 

    const handleUserActivity = () => resetTimer();

    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearTimeout(timerRef.current);
    };
  }, [navigate, timeout]);

  return null;
};

export default useInactivityTimer;
