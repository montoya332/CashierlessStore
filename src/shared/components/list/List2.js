import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios/index';

class List2 extends Component {
    state = {
        items: [],
    };

    getItems = () => {
        axios.post('/api/order/getOrder', { email: 'harsh@xyz.com' }).then((response) => {
            console.log(response.data.items);
            return response.data.items.map((item) => {
                return <div>{item.Name}</div>;
            });
        });
    };

    render() {
        return <div>{this.getItems()}</div>;
    }
}

export default List2;
