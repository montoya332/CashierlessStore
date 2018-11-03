import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = () => ({});

class ReviewOrder extends React.Component {
    constructor(props) {
        super(props);
    }
    returnItem(item) {
        return (
            <ListItem>
                <ListItemText primary={item.Name || ''} />
            </ListItem>
        );
    }
    render() {
        const orderItems = this.props.orderItems || stubData();
        return (
            <div>
                ReviewOrder <List>{orderItems.map(this.returnItem)}</List>
            </div>
        );
    }
}

ReviewOrder.propTypes = {
    orderItems: PropTypes.array,
};

export default withStyles(styles)(ReviewOrder);

function stubData() {
    return [
        { Name: 'Plant', Confidence: 99.71910858154297 },
        { Name: 'Vegetable', Confidence: 98.99150085449219 },
        { Name: 'Food', Confidence: 98.99150085449219 },
        { Name: 'Broccoli', Confidence: 98.99150085449219 },
        { Name: 'Banana', Confidence: 97.18341064453125 },
        { Name: 'Fruit', Confidence: 97.18341064453125 },
        { Name: 'Carrot', Confidence: 72.56779479980469 },
    ];
}
