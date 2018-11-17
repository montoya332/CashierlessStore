import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Camera from '../../components/camera';
import { connect } from 'react-redux';
import { signInUser } from '../../store/app/actions';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit *
            3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class SignIn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleUploadFile = this.handleUploadFile.bind(this);
    }
    handleUploadFile(dataUri) {
        const data = new FormData();
        data.append('file', dataUri);
        axios.post('/api/rekognition/searchFacesByImage', data).then((response) => {
            if (response.data && response.data.ExternalImageId) {
                this.props.signInUser(response.data);
            }
        });
    }
    render() {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Link to="/signup">
                        <Typography variant="caption" gutterBottom>
                            Dont Have and account? Sign up
                        </Typography>
                    </Link>
                    <Camera onTakePhoto={this.handleUploadFile} />
                </Paper>
            </main>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
    signInUser: PropTypes.func,
};
const mapDispatchToProps = { signInUser };
const mapStateToProps = () => {
    return {};
};
const SignInWithConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);

export default withStyles(styles)(SignInWithConnected);
