import { StyledTable, TableWrapper } from './styles';

import React from 'react';

type Props = {
  children: React.ReactNode;
  $striped?: boolean;
  $bordered?: boolean;
  $condensed?: boolean;
  $hover?: boolean;
  $responsive?: boolean;
  $whiteSpace?: string;
  $alignTop?: boolean;
  $wideHeader?: boolean;
};

class Table extends React.Component<Props> {
  static defaultProps = {
    required: false,
    $striped: false,
    $bordered: false,
    $condensed: false,
    $hover: false,
    $responsive: false,
    $alignTop: false,
  };

  render() {
    return (
      <TableWrapper>
        <StyledTable {...this.props} />
      </TableWrapper>
    );
  }
}

export default Table;
