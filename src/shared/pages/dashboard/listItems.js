import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import HistoryIcon from '@material-ui/icons/History';
import ListIcon from '@material-ui/icons/List';
import { Link } from 'react-router-dom';
import axios from 'axios';
import css from '../../App.module.css';

const handleSignOut = () =>
    axios.get('/api/rekognition/signout').then(() => {
        window.location.reload();
    });
export const mainListItems = (
    <div>
        <ListItem component={Link} to="/account" button>
            <ListItemIcon>
                <PeopleIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Manage Account" />
        </ListItem>
        <ListItem component={Link} to="/order" button>
            <ListItemIcon>
                <ShoppingCartIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Order" />
        </ListItem>
        <ListItem component={Link} to="/analytics" button>
            <ListItemIcon>
                <BarChartIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Saved reports</ListSubheader>
        <ListItem component={Link} to="/orderhistory" button>
            <ListItemIcon>
                <HistoryIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Order History" />
        </ListItem>
        <ListItem component={Link} to="/products" button>
            <ListItemIcon>
                <ListIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Products" />
        </ListItem>
        <br />
        <br />
        <br />
        <ListItem component={Link} to="/signin" onClick={handleSignOut} button>
            <ListItemIcon>
                <SignOutIcon className={css.muiIcon} />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
        </ListItem>
    </div>
);
