import React, { useState } from 'react';

type ImgProps = {
  src: string,
  width?: string,
  height?: string
};

function getHeight() {
  const factor = ((Math.random() * 30) + 70) / 100;

  return `${factor * 320}px`;
}


export default function LazyImage(props: ImgProps) {
  const { src, width, height, ...rest } = props;
  const [loading, setLoading] = useState(true);


  function onLoad() {
    console.log("IMAGE LOADED");
    setLoading(false);
  }

  const style = {
    display: 'inline-block',
    width,
    height: loading? (height || getHeight()) : 'auto',
    backgroundColor: 'grey',
    margin: '0px',
    padding: '0px'
  };

  return (
    <div {...rest} style={style}>
      <img src={src}
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
    </div>
  )
}
