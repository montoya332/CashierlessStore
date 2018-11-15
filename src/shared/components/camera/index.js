import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './styles.css';

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
            <div className="camera-container">
                <Camera
                    idealFacingMode={facingMode}
                    onTakePhoto={this.onTakePhoto}
                    imageType={IMAGE_TYPES.PNG}
                />
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
