import React, { useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton'

type ImgProps = {
  src: string,
  width?: string,
  height?: string,
  className?: string
};


export default function LazyImage(props: ImgProps) {
  const { src, width, height, className, ...rest } = props;
  const [loading, setLoading] = useState(true);


  function onLoad() {
    setLoading(false);
  }

  return (
    <Skeleton variant='rect' disableAnimate={!loading} width={width} height={height}>
      <img src={src}
           className={className}
           alt='img' style={
             {
               margin: '0px',
               display: 'block',
               padding: '0px',
               visibility: loading? 'hidden':'visible'
             }}
           width={width}
           height={height}
           onLoad={onLoad}
           {...rest}
      />
    </Skeleton>
  )
}
