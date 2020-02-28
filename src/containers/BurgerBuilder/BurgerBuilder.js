import React, { Component } from 'react';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from './../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad : 0.5,
    cheese : 0.4,
    bacon : 0.7,
    meat : 1.3
};

class BurgerBuilder extends Component {

    state = {
        ingredients : null,
        totalPrice : 4,
        purchasable : false,// Local UI State but being passed between components
        purchasing : false,// Local UI State
        loading : false,// Local UI State
        error : false// Local UI State
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients : response.data})
            })
            .catch(err => {
                this.setState({error : true});
                console.log('Err:::', err);
            })
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey];
                    })
                    .reduce((sum, el) => {
                        return sum + el;
                    },0);

        this.setState({purchasable : sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAdd = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAdd;
        this.setState({ ingredients : updatedIngredients, totalPrice : newPrice });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount > 0) {
            const updatedCount = oldCount - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            };

            updatedIngredients[type] = updatedCount;
            const priceSub = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceSub;
            this.setState({ ingredients : updatedIngredients, totalPrice : newPrice });
            this.updatePurchaseState(updatedIngredients);
        }
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing : false});
    }

    purchaseContinueHandler = () => {
        const queryParams = [];

        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname : '/checkout',
            search : '?' + queryString
        });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!!!</p> : <Spinner />;

        if(this.state.ingredients) {
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientsAdded={this.addIngredientHandler}
                        ingredientsRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>
            );
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

export default withErrorHandler(BurgerBuilder, axios);