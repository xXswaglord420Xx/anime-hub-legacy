import React from 'react';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import styles from './Pagination.css';
import {range} from "../../utils/util";

type PaginationProps = {
  page: number,
  lastPage: number,
  onPageChange: number
};

const preferredSideButtons = 2;

export default function Pagination(props: PaginationProps) {
  const {page, lastPage, onPageChange} = props;
  const pageStart = Math.max(page - preferredSideButtons, 1);
  const pageEnd = Math.min(page + preferredSideButtons, lastPage);

  const firstPageButton = pageStart === 1 ? null : ([
      <Button onClick={() => onPageChange(1)}>1</Button>,
      <Button variant="contained" disabled>&hellip;</Button>
    ]
  );

  const lastPageButton = pageEnd === lastPage ? null : ([
      <Button variant="contained" disabled>&hellip;</Button>,
      <Button onClick={() => onPageChange(lastPage)}>{lastPage}</Button>
    ]
  );

  return (
    <div className={styles.paginationRoot}>
      <ButtonGroup color='secondary'>
      {firstPageButton}
      {
        [...range(pageStart, pageEnd + 1)]
          .map(n => <Button onClick={() => onPageChange(n)} variant={n === page? "contained" : "outlined"} disabled={n === page}>{n}</Button>)
      }
      {lastPageButton}
      </ButtonGroup>
    </div>
  );
}
