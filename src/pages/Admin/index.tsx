import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../../components";
import { ProgressProps, TradeProps } from "../../store/types";
import { Injected } from "../../utils/connector";
import { cancelTrade, getAllPendingTrades, getOwner } from "../../utils/methods";
import "./Admin.scss";

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState<undefined | boolean>(undefined);
  const { active, activate, account } = useWeb3React();
  const [allTrades, setAllTrades] = useState<TradeProps[]>([]);
  const [progress, setProgress] = useState<ProgressProps>({
    loading: false,
    type: "loading",
    message: "",
  });

  const handleGetTrades = useCallback(async () => {
    if (account) {
      setLoading(true);
      const isAdmin = (await getOwner()) as string;
      if (isAdmin.toLocaleLowerCase() === account.toLocaleLowerCase()) {
        setIsOwner(true);
        const data = await getAllPendingTrades();

        if (data) {
          setAllTrades(data);
          console.log(data);
        }
      } else {
        setIsOwner(false);
      }
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    handleGetTrades();
  }, [handleGetTrades]);

  const handleCancelTrade = async (id: string) => {
    setProgress({
      loading: true,
      message: "Please wait your transaction is on progress...",
      type: "loading",
    });
    try {
      await cancelTrade(id);
      setProgress({
        loading: true,
        message: "Transaction completed successfully",
        type: "success",
      });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
    } catch (error) {
      console.log(error);
      setProgress({ loading: true, message: "Transaction cancelled.", type: "error" });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
    }
  };

  const handleConnect = async () => {
    setProgress({
      loading: true,
      message: "Metamask wallet is connecting...",
      type: "loading",
    });
    try {
      await activate(Injected);
      setProgress({
        loading: true,
        message: "connected successfully",
        type: "success",
      });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
    } catch (error) {
      console.log(error);
      setProgress({ loading: true, message: "Transaction cancelled", type: "error" });
      setTimeout(() => {
        setProgress({ ...progress, loading: false });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="center_content">
        <h5 style={{ color: "#fff" }}>Loading...</h5>
      </div>
    );
  }

  if (isOwner === false) {
    return (
      <div className="center_content">
        <h5 style={{ color: "#fff" }}>You're not a admin for this contract.</h5>
      </div>
    );
  }

  return (
    <>
      {!active ? (
        <div className="center_content">
          <Button onClick={() => handleConnect()}>Connect wallet</Button>
        </div>
      ) : (
        <div>
          <div className="job_card_wrapper">
            {allTrades.map((data) => {
              return (
                <div className="job_card" key={data.id}>
                  <div className="job_card_grid">
                    <div className="card_content">
                      <h3 className="mb-15">
                        creator address :{" "}
                        <span style={{ color: "#ffa624" }}>{`${data.creator.slice(
                          0,
                          8
                        )}...${data.creator.slice(data.creator.length - 8)}`}</span>
                      </h3>
                      <h3>
                        Hirer address :{" "}
                        <span style={{ color: "#ffa624" }}>{`${data.trader.slice(
                          0,
                          8
                        )}...${data.trader.slice(data.trader.length - 8)}`}</span>
                      </h3>
                      <div className="card_content-details mt-20">
                        <h5>
                          <span>Title :</span> {data.title}
                        </h5>
                      </div>
                      <div className="mt-30">
                        <Button
                          disabled={progress.loading}
                          onClick={() => handleCancelTrade(data.id)}
                        >
                          Cancel Trade
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
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

export default Admin;
