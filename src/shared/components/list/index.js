import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const MappedList = (props) => (
    <List>
        {props.items &&
            props.items.map((item, key) => {
                let price;
                if (item.Name === 'Plant') {
                    price = 5;
                } else if (item.Name === 'Vegetable') {
                    price = 10;
                } else if (item.Name === 'Food') {
                    price = 15;
                } else if (item.Name === 'Broccoli') {
                    price = 4;
                } else if (item.Name === 'Banana') {
                    price = 2;
                } else if (item.Name === 'Fruit') {
                    price = 5;
                } else {
                    price = 2;
                }

                return (
                    <ListItem key={key}>
                        <ListItemText primary={item.Name || ''} />

                        <p>{price}</p>
                    </ListItem>
                );
            })}
    </List>
);

MappedList.propTypes = {
    items: PropTypes.array,
};

export default MappedList;
