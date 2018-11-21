import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
};

let id = 0;
function createData(name, qty) {
    id += 1;
    return { id, name, qty };
}

const data = [
    createData('Apple', 1),
    createData('Ice cream sandwich', 1),
    createData('Milk', 1),
    createData('Cupcake', 1),
    createData('Gingerbread', 1),
];

function OrderHistory(props) {
    const { classes } = props;

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell numeric>qty</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((n) => {
                        return (
                            <TableRow key={n.id}>
                                <TableCell component="th" scope="row">
                                    {n.name}
                                </TableCell>
                                <TableCell numeric>{n.qty}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

OrderHistory.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderHistory);
