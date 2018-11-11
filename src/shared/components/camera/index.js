import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class ReactCamera extends Component {
    onTakePhoto = (dataUri) => {
        this.props.onTakePhoto && this.props.onTakePhoto(dataUri);
    };

    render() {
        let facingMode = FACING_MODES.ENVIRONMENT;
        if (this.props.selfie) {
            facingMode = FACING_MODES.USER;
        }
        return (
            <div className="App">
                <Camera idealFacingMode={facingMode} onTakePhoto={this.onTakePhoto} />
            </div>
        );
    }
}
ReactCamera.defaultProps = { onTakePhoto: () => {} };

ReactCamera.propTypes = {
    selfie: PropTypes.bool,
    onTakePhoto: PropTypes.func,
};
export default ReactCamera;
