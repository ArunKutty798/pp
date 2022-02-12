import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { BrowserRouter } from "react-router-dom";
import Web3 from "web3";
import App from "./App";
import "./index.scss";
import Provider from "./store/Provider";

const getLibrary = (provider: any) => {
  return new Web3(provider);
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider>
          <App />
        </Provider>
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
