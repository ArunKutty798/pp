import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { TradeProps } from "../store/types";
import paypalabi from "./abi/bloackplace.json";

const { ethereum } = window as any;

const web3 = new Web3(ethereum);
const paypaladdress = "0xF9d6F4FBd47E3E638ce5301fAe5E14E64505Ced6";

const paypal = new web3.eth.Contract(paypalabi as AbiItem[], paypaladdress);

export const createTrade = async (amount, trader: string, address: string, title: string) => {
  const amt = web3.utils.toWei(amount);
  await paypal.methods.createTrade(amt, trader, title).send({
    from: address,
    value: amt,
  });
};

export const endTrade = async (id, address: string) => {
  await paypal.methods.endTrade(id).send({
    from: address,
  });
};

export const balance = async (address: string) => {
  return await paypal.methods.balance(address).call();
};

export const tradeDetails = async (id) => {
  return await paypal.methods.trades(id).call();
};

export const getId = async (address: string) => {
  return await paypal.methods.getId(address).call();
};

export const getPendingTrades = async (address: string) => {
  try {
    const tradeIds: string[] = await getId(address);

    const result = await Promise.all(
      tradeIds.map(async (id) => {
        const details: TradeProps = await tradeDetails(id);
        return {
          amount: web3.utils.fromWei(details.amount),
          creator: details.creator,
          trader: details.trader,
          title: details.title,
          id: details.id,
          status: details.status,
        };
      })
    );

    return result.filter((f) => f.status === "0");
  } catch (error) {
    console.log(error);
  }
};

export const getCompletedTrades = async (address: string) => {
  try {
    const tradeIds: string[] = await getId(address);
    const result = await Promise.all(
      tradeIds.map(async (id) => {
        const details: TradeProps = await tradeDetails(id);
        return {
          amount: web3.utils.fromWei(details.amount),
          creator: details.creator,
          trader: details.trader,
          title: details.title,
          id: details.id,
          status: details.status,
        };
      })
    );
    console.log(result);

    return result.filter((f) => f.status === "2");
  } catch (error) {
    console.log(error);
  }
};
