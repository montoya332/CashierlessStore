import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const MappedList = (props) => (
    <List>
        {props.items &&
            props.items.map((item, key) => {
                var price;
                if (item.Name == 'Plant') {
                    price = 5;
                } else {
                    price = 10;
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
