import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = Styled.div`
    height: 420px;
    width: 90%;
    margin-left: 10%;
`;

const H1 = Styled.h1`
    margin-bottom: 50px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const category = (props) => {
    return (
        <Div>
            <H1>Your Last Order</H1>
            <HorizontalBar
                data={props.chartData}
                width={100}
                height={50}
                options={{
                    maintainAspectRatio: false,
                }}
            />
        </Div>
    );
};
category.propTypes = {
    chartData: PropTypes.object,
};
export default category;
