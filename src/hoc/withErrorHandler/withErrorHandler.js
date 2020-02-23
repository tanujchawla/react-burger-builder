import React, { Component } from 'react';

import Modal from './../../components/UI/Modal/Modal';
import Aux from './../Auxillary/Auxillary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error : null
        };

        // we won't use componentDidMount here because it will only be executed 
        //after child components' componentDidMount, but if we encounter an error in child 
        //component componentDidMount we will never get here so interceptors won't be set 
        //so we'll use constructor here (as componentWillMount will be removed from react)
        //componentDidMount() {
        constructor() {
            super();
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error : null});
                return req;
            });

            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error : error});
            });
        }

        errorConfirmedHandler = () => {
            this.setState({error : null});
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render () {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;