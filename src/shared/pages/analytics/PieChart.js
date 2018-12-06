import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

const Div = Styled.div`
    height: 350px;
    width: 90%;
    margin-left: 10%;
`;

const H1 = Styled.h1`
    margin-bottom: 50px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const pieChart = (props) => {
    return (
        <Div>
            <H1>Top products purchased by you</H1>
            <Doughnut
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
pieChart.propTypes = {
    chartData: PropTypes.object,
};
export default pieChart;
