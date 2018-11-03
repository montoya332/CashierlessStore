import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import axios from 'axios';
const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class CartDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: '',
        };
        this.uploadInput = React.createRef();
        this.handleUploadFile = this.handleUploadFile.bind(this);
    }
    handleUploadFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);
        data.append('name', 'name');
        data.append('description', 'description');
        // '/files' is your node.js route that triggers our middleware
        axios.post('/api/rekognition/detectLabels', data).then((response) => {
            this.props.formCompleted && this.props.formCompleted(response);
            console.log(response); // do something with the response
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <form>
                <div>
                    <h3>Cart Details</h3>
                    <input
                        accept="image/*"
                        className={classes.input}
                        ref={this.uploadInput}
                        type="file"
                        id="icon-button-file-cart"
                        name="image"
                        onChange={this.handleUploadFile}
                    />
                    <label htmlFor="icon-button-file-cart">
                        <IconButton color="primary" className={classes.button} component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </div>
                {this.state.imageURL && <img src={this.state.imageURL} alt="img" />}
            </form>
        );
    }
}

CartDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    formCompleted: PropTypes.function,
};

export default withStyles(styles)(CartDetails);
