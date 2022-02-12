import { InjectedConnector } from "@web3-react/injected-connector";

export const Injected = new InjectedConnector({
  supportedChainIds: [4],
});

const switchRequest = () => {
  const { ethereum } = window as any;
  return ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x4" }],
  });
};

export const switchNetwork = async () => {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      await switchRequest();
    } catch (error: any) {
      console.log(error);
    }
  }
};
