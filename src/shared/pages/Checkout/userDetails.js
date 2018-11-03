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
        axios.post('/api/rekognition/searchFacesByImage', data).then((response) => {
            this.props.formCompleted && this.props.formCompleted(response);
            if (response.data && response.data.ExternalImageId) {
                console.log(response.data.ExternalImageId);
            }
            console.log(response); // do something with the response
        });
    }
    render() {
        const { classes } = this.props;

        return (
            <form>
                <div>
                    <h3>User Details</h3>
                    <input
                        accept="image/*"
                        className={classes.input}
                        ref={this.uploadInput}
                        type="file"
                        id="icon-button-file-user"
                        name="image"
                        onChange={this.handleUploadFile}
                    />
                    <label htmlFor="icon-button-file-user">
                        <IconButton color="primary" className={classes.button} component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </div>
            </form>
        );
    }
}

CartDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    formCompleted: PropTypes.function,
};

export default withStyles(styles)(CartDetails);
