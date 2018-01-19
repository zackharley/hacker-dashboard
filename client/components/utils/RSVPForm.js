import { required, email } from 'redux-form-validators';
import SemanticFormField from './SemanticFormField';
import { Field, reduxForm } from 'redux-form';
import React, { Component } from 'react';

class RSVPForm extends Component {
    constructor(props) {
        super(props);

        this.renderRSVPForm.bind(this);
    }

    renderRSVPFormErrorMessage() {
        return (
            <Message
                error
                size='small'
                className="error-message"
                header='Invalid Credentials!'
                content='Oops! We cannot authenticate you with those credentials.'
            />
        );
    }

    renderRSVPForm() {
        return (
            <Form size="large"
                  error={this.props.loginError}
                  loading={this.props.loginLoading}
                  onSubmit={this.props.handleSubmit}>

                <Field name="email"
                       component={SemanticFormField}
                       as={Form.Input}
                       icon="mail"
                       type="email"
                       placeholder="Email address"
                       validate={[required({ msg: 'none' }), email({ msg: 'Please enter a valid email address!' })]}/>

                <Field name="password"
                       component={SemanticFormField}
                       as={Form.Input}
                       icon="lock"
                       type="password"
                       placeholder="Password"
                       validate={required({ msg: 'none' })}/>

                {this.renderLoginFormErrorMessage()}

                <Button primary fluid size="large">
                    Login
                </Button>
            </Form>
        );
    }

    render() {
        return (
            <div className="rsvp-form-container">
                {this.renderRSVPForm()}
                {this.renderRSVPFormFooter()}
            </div>
        );
    }
}

export default reduxForm({
    form: 'rsvp',
    enableReinitialize: true
})(RSVPForm);
