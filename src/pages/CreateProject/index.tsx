import React, { useContext, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

import { createTrade } from "../../utils/methods";
import "./CreateProject.scss";
import { Button } from "../../components";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../../utils/connector";
import { UserContext } from "../../store/UserContext";
import { ProgressProps } from "../../store/types";

const initialValues = {
  title: "",
  budget: "",
  hirer: "",
};

const CreateProject: React.FC = () => {
  const { activate, active, account } = useWeb3React();
  const { userData } = useContext(UserContext);
  const [progress, setProgress] = useState<ProgressProps>({
    loading: false,
    type: "loading",
    message: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(50, "Title can't exceed more than 50 characters")
      .required("This field is required"),
    budget: Yup.number().moreThan(0, "amount can't be zero").required("Description is required"),
    hirer: Yup.string().required("This field is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting, resetForm }) => {
    try {
      if (!account) {
        alert("connect your wallet to proceed");
        return;
      }
      if (userData?.userAccount?.toLocaleLowerCase() !== account.toLocaleLowerCase()) {
        alert(
          `connect your account to registered one.This wallet address is not registered\n your Registered account is ${userData?.userAccount}`
        );
        return;
      }
      setProgress({
        loading: true,
        message: "Please wait your transaction is on progress...",
        type: "loading",
      });
      await createTrade(String(values.budget), values.hirer, account, values.title);
      setProgress({
        loading: true,
        message: "Trade created successfully",
        type: "success",
      });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.log(error);
      setProgress({ loading: true, message: "Transaction cancelled.", type: "error" });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
    }
  };

  const handleConnect = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Install metamask extension in your browser");
      return;
    }
    setProgress({
      loading: true,
      message: "Metamask wallet is connecting...",
      type: "loading",
    });
    try {
      await activate(Injected);
      setProgress({ ...progress, loading: false });
    } catch (error) {
      console.log(error);
      setProgress({ ...progress, loading: false });
    }
  };

  return (
    <>
      <div className="create_project_route">
        <h1>HIRE FOR THE JOB</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="form_group">
                <label htmlFor="title">Title of the project</label>
                <Field name="title" placeholder="Title of your project" />
                <ErrorMessage name="title" className="error_input" component="div" />
              </div>
              {/* <div className="form_group">
              <label htmlFor="description">Work description</label>
              <Field
                as="textarea"
                name="description"
                placeholder="description of your project"
                rows="4"
              />
              <ErrorMessage name="description" className="error_input" component="div" />
            </div> */}
              <div className="form_group">
                <label htmlFor="buget">Budget</label>
                <Field name="budget" placeholder="Budget of your project" type="number" />
                <ErrorMessage name="budget" className="error_input" component="div" />
              </div>
              <div className="form_group">
                <label htmlFor="hirer">Hirer Address</label>
                <Field name="hirer" placeholder="Hirer address" />
                <ErrorMessage name="hirer" className="error_input" component="div" />
              </div>
              <div>
                {!active ? (
                  <Button type="button" onClick={() => handleConnect()} disabled={progress.loading}>
                    Connect wallet
                  </Button>
                ) : (
                  <Button type="submit" disabled={progress.loading}>
                    Hire
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {progress.loading && (
        <div className="modal">
          <div className="modal_content">
            <h4>{progress.message}</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProject;
