import React from 'react';
import Pie from './PieChart';
import Budget from './Budget';
import Category from './Category';
import axios from 'axios/index';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Chart extends React.Component {
    state = {
        products: null,
        items: null,
        budgetData: {
            labels: ['November', 'December'],
            datasets: [
                {
                    label: 'Amount Spent in USD',
                    data: [],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255,99,132,1)'],
                    borderWidth: 1,
                },
            ],
        },
        chartData: {
            labels: [],
            datasets: [
                {
                    label: '# of items purchased',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        categorydata: {
            labels: [],
            datasets: [
                {
                    label: 'Money Spent',
                    data: [],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(230,126,34,0.2)',
                        'rgba(255,82,82, 0.4)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(247,143,179, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(230,126,34,1)',
                        'rgba(255,82,82,1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(247,143,179, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
    };
    componentDidMount() {
        const { user } = this.props;
        console.log('User: ', user);
        axios.post('/api/order/getOrderHistory', { email: user.email }).then(({ data }) => {
            const chart = { ...this.state.chartData };
            const category = { ...this.state.categorydata };
            const budget = { ...this.state.budgetData };
            const blabels = ['November', 'December'];
            const bdata = [];
            const clabels = [];
            const cprice = [];
            const labels = [];
            const price = [];
            data.products.map((data) => {
                labels.push(data.name);
                price.push(data.price);
            });
            bdata.push(0);
            bdata.push(price.reduce((a, b) => a + b, 0));
            data.items.map((data) => {
                clabels.push(data.Name);
                cprice.push(data.price);
            });
            budget.labels = blabels;
            budget.datasets[0].data = bdata;
            category.labels = clabels;
            category.datasets[0].data = cprice;
            chart.labels = clabels;
            chart.datasets[0].data = cprice;

            this.setState({
                products: data.products,
                items: data.items,
                chartData: chart,
                categorydata: category,
            });
        });
    }
    render() {
        const { items, products, chartData, categorydata } = this.state;
        console.log('render: ', { items, products, chartData, categorydata });

        if (!items) {
            return <p>Loading</p>;
        } else if (!items.length) {
            return <p>No Items Purchased</p>;
        }

        return (
            <div>
                <Category chartData={this.state.categorydata} />
                <br />
                <Budget chartData={this.state.budgetData} />
                <br />
                <Pie chartData={this.state.chartData} />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};
const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);

Chart.propTypes = {
    user: PropTypes.object,
};
