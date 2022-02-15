import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import "./Auth.scss";
import logo from "../../assets/abstracts/logo.png";
import { ReactComponent as SignUpAbstract } from "../../assets/abstracts/signup.svg";
import { Button } from "../../components";
import { signUpApi } from "../../api";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../../utils/connector";

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { activate, account, active } = useWeb3React();

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(50, "username can't exceed more than 50 characters")
      .required("username is required"),
    email: Yup.string().email("Invalid email").required("email is required"),
    password: Yup.string()
      .min(8, "password must be atleast 8 characters required")
      .required("password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("confirm password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!active) {
        alert("connect your wallet to proceed");
        return;
      }
      const { data } = await signUpApi({ ...values, account });
      if (data.error === true) {
        alert(data.message);
        return;
      }
      localStorage.setItem("blockplace_id", data);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await activate(Injected);
    } catch (error) {
      console.log(error);
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
          <SignUpAbstract />
        </div>
      </div>
      <div className="auth_page_form">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="form">
                <div>
                  <h2>Signup</h2>
                </div>
                <div className="form_input">
                  <Field name="username" placeholder="Username" />
                  <ErrorMessage name="username" className="error_input" component="div" />
                </div>
                <div className="form_input">
                  <Field name="email" placeholder="Email" />
                  <ErrorMessage name="email" className="error_input" component="div" />
                </div>
                <div className="form_input">
                  <Field type="password" name="password" placeholder="Password" />
                  <ErrorMessage name="password" className="error_input" component="div" />
                </div>
                <div className="form_input">
                  <Field type="password" name="confirmPassword" placeholder="Confirm password" />
                  <ErrorMessage name="confirmPassword" className="error_input" component="div" />
                </div>
                <div className="wallet_Input">
                  <div className="group">
                    <input
                      name="walletAddress"
                      value={active && account ? account : ""}
                      placeholder="Wallet address"
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={() => handleConnect()}
                      style={{ padding: 5, width: "fit-content" }}
                    >
                      Connect
                    </Button>
                  </div>
                  <div className="error_input"></div>
                </div>
                <Button type="submit" disabled={loading}>
                  Signup
                </Button>
              </div>
              <div className="form_footer">
                <p>already have an account?</p>
                <Link to="/login">Login</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
