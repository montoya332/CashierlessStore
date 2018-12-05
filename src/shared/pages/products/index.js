import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios/index';

const styles = {
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    progress: {
        marginTop: '100px',
    },
};

class SimpleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
        };
    }
    componentDidMount() {
        axios.get('/api/order/products').then(({ data }) => {
            this.setState({
                products: data.products,
            });
        });
    }
    renderRow = (item, i) => {
        return (
            <TableRow key={i}>
                <TableCell component="th" scope="row">
                    {item.name}
                </TableCell>
                <TableCell numeric>{item.price}</TableCell>
            </TableRow>
        );
    };
    render() {
        const { classes } = this.props;
        const { products } = this.state;
        if (!products) {
            return (
                <Typography component="h1" variant="h4" align="center">
                    <CircularProgress className={classes.progress} />{' '}
                </Typography>
            );
        } else if (!products.length) {
            return (
                <Typography component="h1" variant="h4" align="center">
                    No Store Products
                </Typography>
            );
        }
        return (
            <Paper className={classes.root}>
                <br />
                <Typography component="h1" variant="h4" align="center">
                    Store Products
                </Typography>
                <br />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell numeric>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{products.map(this.renderRow)}</TableBody>
                </Table>
            </Paper>
        );
    }
}
SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
