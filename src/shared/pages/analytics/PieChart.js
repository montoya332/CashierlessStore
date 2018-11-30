import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Styled from 'styled-components';

const Div = Styled.div`
    height: 350px;
    width: 80%;
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
            <Doughnut data={props.chartData} height="20%" width="70%" options={{}} />
        </Div>
    );
};

export default pieChart;
