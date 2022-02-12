import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";

import "./Auth.scss";
import { Button } from "../../components";
import logo from "../../assets/abstracts/logo.png";
import { ReactComponent as SignInAbstract } from "../../assets/abstracts/signup.svg";
import { signInApi } from "../../api";

const initialValues = {
  username: "",
  password: "",
};

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object({
    username: Yup.string().required("username is required"),
    password: Yup.string().required("password is required"),
  });

  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      const { data } = await signInApi(values);
      if (data.error === true) {
        alert(data.message);
        return;
      }
      localStorage.setItem("token", data);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth_page">
      <div className="auth_page_abstracts">
        <div className="auth_page_abstracts-logo">
          <img src={logo} alt="logo" width={250} />
        </div>
        <div className="auth_page_abstracts-content">
          <h2>WE deliver more than you expected.</h2>
          <h4>Start your journey with us.</h4>
        </div>
        <div className="auth_page_abstracts-illustration">
          <SignInAbstract />
        </div>
      </div>
      <div className="auth_page_form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="form">
                <div>
                  <h2>Login</h2>
                </div>
                <div className="form_input">
                  <Field name="username" placeholder="Username" />
                  <ErrorMessage name="username" className="error_input" component="div" />
                </div>
                <div className="form_input">
                  <Field type="password" name="password" placeholder="Password" />
                  <ErrorMessage name="password" className="error_input" component="div" />
                </div>
                <Button disabled={loading}>Login</Button>
              </div>
              <div className="form_footer">
                <p>Don\'t have an account?</p>
                <Link to="/signup">Signup</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
