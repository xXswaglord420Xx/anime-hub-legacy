import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

type LoaderProps = {
  color?: string
};

export default ({color = 'secondary'}: LoaderProps) => <div style={
  {display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}
}><CircularProgress color={color}/></div>
