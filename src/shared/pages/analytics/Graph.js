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
            labels: [
                'January',
                'Febraury',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'Novermber',
            ],
            datasets: [
                {
                    label: 'Amount Spent in USD',
                    data: [12, 19, 3, 5, 2, 22, 36, 12, 24, 10, 35, 5],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        chartData: {
            labels: ['Apple', 'Banana', 'Tomato', 'Chips', 'Bread'],
            datasets: [
                {
                    label: '# of items purchased',
                    data: [12, 19, 3, 5, 2],
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
            labels: [
                'Food',
                'Drinks',
                'Electronics',
                'Clothing',
                'Books',
                'Kitchen and Dining',
                'Toys',
            ],
            datasets: [
                {
                    label: 'Money Spent',
                    data: [12, 6, 3, 5, 12, 32, 4],
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
            const labels = [];
            const price = [];
            data.products.map((data) => {
                labels.push(data.name);
                price.push(data.price);
            });
            chart.labels = labels;
            chart.datasets.data = price;
            this.setState({
                products: data.products,
                items: data.items,
                chartData: chart,
            });
        });
    }
    render() {
        const { items, products, chartData } = this.state;
        console.log('render: ', { items, products, chartData });

        if (!items) {
            return <p>Loading</p>;
        } else if (!items.length) {
            return <p>No Items Purchased</p>;
        }

        return (
            <div>
                <Category chartData={this.state.categorydata} />
                <Budget chartData={this.state.budgetData} />
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
