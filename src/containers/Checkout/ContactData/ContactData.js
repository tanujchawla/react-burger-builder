import React, { Component } from "react";
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import { connect } from 'react-redux';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "../../../shared/utility";

class ContactData extends Component {
    state = {
        orderForm : {
            name :  {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your Name'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            street : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Street'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            zipcode : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'ZIP Code'
                },
                value : '',
                validation : {
                    required : true,
                    minLength : 5,
                    maxLength : 5
                },
                valid : false,
                touched : false
            },
            country : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Country'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            email : {
                elementType : 'email',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your Email'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            deliveryMethod : {
                elementType : 'select',
                elementConfig : {
                    options  : [
                        {
                            value : 'fastest',
                            displayValue : 'Fastest'
                        },
                        {
                            value : 'cheapest',
                            displayValue : 'Cheapest'
                        }
                    ]
                },
                value : 'fastest',
                validation : {},
                valid : true
            }
        },
        formIsValid :  false
    }

    orderHandler = (event) => {
        event.preventDefault();

        // this.setState({ loading : true });

        const formData = {};

        for(let formElement in this.state.orderForm) {
            formData[formElement] = this.state.orderForm[formElement].value;
        }

        const order = {
            // ingredients : this.props.ingredients,
            ingredients : this.props.ings,
            price : this.props.price,
            orderData : formData,
            userId : this.props.userId
        };

        this.props.onOrderBurger(order, this.props.token)

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading : false});
        //         this.props.history.push('/');
        //     })
        //     .catch(err => {
        //         console.log('Errr:::', err);
        //         this.setState({ loading : false});
        //     });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // this might be slower in performance
        // const updatedOrderForm = JSON.parse(JSON.stringify(this.state.orderForm));
        // updatedOrderForm[inputIdentifier].value = event.target.value;

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value : event.target.value,
            valid : checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched : true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier] : updatedFormElement
        })

        let formIsValid = true;

        for(let input in updatedOrderForm) {
            formIsValid = updatedOrderForm[input].valid && formIsValid;
        }

        this.setState({orderForm : updatedOrderForm, formIsValid : formIsValid});
    }

    render() {
        let formElements = [];

        for(let key in this.state.orderForm) {
            formElements.push({
                id : key,
                config : this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {
                    formElements.map(formElement =>  (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        />
                    ))
                }
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if(this.props.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    } 
}

const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice,
        loading : state.order.loading,
        token : state.auth.token,
        userId : state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger : (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));