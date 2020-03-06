import React, { Component } from "react";
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from "./ContactData/ContactData";
import { connect } from 'react-redux';

class Checkout extends Component {

    //// Handling state via redux now

    // state = {
    //     ingredients : {
    //         salad : 0,
    //         bacon : 0,
    //         cheese : 0,
    //         meat : 0
    //     },
    //     totalPrice : 0
    // }

    /////// Handling with redux
    
    // componentDidMount() {
        // const query = new URLSearchParams(this.props.location.search);
        // const ingredients = {};
        // let price = 0;
        // for(let param of query.entries()) {
        //     // param = ['salad', '1']
        //     if(param[0] === 'price') {
        //         price = param[1];
        //     } else {
        //         ingredients[param[0]] = +param[1];
        //     }
        // }
        // this.setState({ingredients : ingredients, totalPrice : price });
    // }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.props.ings}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                {/* This way we do not get history in props */}
                <Route path={this.props.match.path + '/contact-data'} 
                    // render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} // Because of redux, we will have data there
                    component={ContactData}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings : state.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);