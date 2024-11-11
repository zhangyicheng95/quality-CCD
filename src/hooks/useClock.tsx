import moment from 'moment';
import { useEffect, useState } from 'react';

const useClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const time = setInterval(() => {
      setTime(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => {
      time && clearInterval(time);
    };
  }, []);
  return { time };
};

export default useClock;
