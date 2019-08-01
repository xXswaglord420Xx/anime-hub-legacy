import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Link = React.forwardRef((props, ref) => <RouterLink {...props} innerRef={ref} />);

type Props = {
  primary: string,
  to: any
};

export function ListItemLink(props: Props) {
  const { primary, to } = props;
  return (
    <li>
      <ListItem button component={Link} to={to}>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
