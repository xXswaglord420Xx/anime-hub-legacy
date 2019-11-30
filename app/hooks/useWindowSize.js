import {useLayoutEffect, useState} from 'react';
import {debounce} from "../utils/util";

export const useWindowSize = () => {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useLayoutEffect(() => {
    const onResize = debounce(100)(() => {
      setSize({width: window.innerWidth, height: window.innerHeight});
    });
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
};
