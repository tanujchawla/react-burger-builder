import React, { Component } from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Order from './Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

class Orders extends Component {

    // state = {
    //     orders : [],
    //     loading : true
    // }

    componentDidMount() {
        // axios.get('/orders.json')
        //     .then(response => {
        //         const fetchedOrders = [];

        //         for(let key in response.data) {
        //             fetchedOrders.push({
        //                 ...response.data[key],
        //                 id : key
        //             });
        //         }

        //         this.setState({loading : false, orders : fetchedOrders});
        //     })
        //     .catch(err => {
        //         this.setState({loading : false});
        //     });

        this.props.onFetchOrders();

    }

    render() {
        let orders = <Spinner />;   
        
        if(!this.props.loading) {
            orders = (
                <div>
                    {this.props.orders.map(order => {
                        return (
                            <Order
                                key={order.id}
                                ingredients={order.ingredients}
                                price={order.price}
                            />
                        );
                    })}
                </div>
            );
        }
    
        return (orders);
    }
}

const mapStateToProps = state => {
    return {
        orders : state.order.orders,
        loading : state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders : () => dispatch(actions.fetchOrders())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));