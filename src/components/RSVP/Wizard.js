import React from "react";
import { Formik } from "formik";
import { Form, Button } from "semantic-ui-react";

export default class Wizard extends React.Component {
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues
    };
  }

  next = values => {
    this.setState(state => ({
      page: Math.min(state.page + 1, this.props.children.length - 1),
      values
    }));
  };

  previous = () => {
    this.setState(state => ({
      page: Math.max(state.page - 1, 0)
    }));
  };

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = (values, bag) => {
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return onSubmit(values, bag);
    } else {
      bag.setTouched({});
      bag.setSubmitting(false);
      this.next(values);
    }
  };

  render() {
    const { children } = this.props;
    const { page, values } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;
    return (
      <Formik
        initialValues={values}
        enableReinitialize={false}
        validate={this.validate}
        onSubmit={this.handleSubmit}
        render={({ handleSubmit, isSubmitting }) => (
          <Form size="large" onSubmit={handleSubmit} loading={isSubmitting}>
            {activePage}
            <>
              {page > 0 && (
                <Button secondary type="button" onClick={this.previous}>
                  Prev
                </Button>
              )}
              {isLastPage ? (
                <Button color="green" type="submit">
                  Submit
                </Button>
              ) : (
                <Button primary type="submit">
                  Next
                </Button>
              )}
            </>
          </Form>
        )}
      />
    );
  }
}
