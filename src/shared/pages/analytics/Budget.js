import React from 'react';
import { Line } from 'react-chartjs-2';
import Styled from 'styled-components';

const Div = Styled.div`
    height: 450px;
    width: 80%;
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
            <Line data={props.chartData} height="30%" width="100%" options={{}} />
        </Div>
    );
};

export default budget;
