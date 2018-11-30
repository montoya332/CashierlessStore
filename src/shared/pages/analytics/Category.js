import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import Styled from 'styled-components';

const Div = Styled.div`
    height: 420px;
    width: 80%;
    margin-left: 10%;
`;

const H1 = Styled.h1`
    margin-bottom: 50px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const category = (props) => {
    return (
        <Div>
            <H1>Your Spendings</H1>
            <HorizontalBar data={props.chartData} height="30%" width="100%" options={{}} />
        </Div>
    );
};

export default category;
