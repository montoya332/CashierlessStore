import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

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

        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleUploadImage(ev) {
        ev.preventDefault();
        const uploadInput = this.uploadInput.current;
        console.log(uploadInput);
        const data = new FormData();
        data.append('file', uploadInput.files[0]);
        data.append('filename', uploadInput.files[0]);

        fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            response.json().then((body) => {
                this.setState({ imageURL: `http://localhost:8000/${body.file}` });
            });
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <form onSubmit={this.handleUploadImage}>
                <div>
                    <input
                        accept="image/*"
                        className={classes.input}
                        ref={this.uploadInput}
                        type="file"
                        id="icon-button-file"
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" className={classes.button} component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </div>
                <br />
                <div>
                    <button>Upload</button>
                </div>
                {this.state.imageURL && <img src={this.state.imageURL} alt="img" />}
            </form>
        );
    }
}

CartDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CartDetails);
