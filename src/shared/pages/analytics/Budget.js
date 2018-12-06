import React from 'react';
import { Line } from 'react-chartjs-2';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = Styled.div`
    height: 450px;
    width: 90%;
    margin: 0 10%;
`;

const H1 = Styled.h1`
    margin-bottom: 50px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const budget = (props) => {
    return (
        <Div>
            <H1>Monthly Budget</H1>
            <Line
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
budget.propTypes = {
    chartData: PropTypes.object,
};
export default budget;
