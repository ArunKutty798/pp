import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useState } from "react";
import { Button, JobStatusCard } from "../../components";
import { TradeProps } from "../../store/types";
import { Injected } from "../../utils/connector";
import { getPendingTrades } from "../../utils/methods";

const PendingProject: React.FC = () => {
  const { activate, account } = useWeb3React();
  const [tradesData, setTradesData] = useState<TradeProps[] | null>(null);

  const handleGetPendingTrades = useCallback(async () => {
    if (account) {
      const data: TradeProps[] | undefined = await getPendingTrades(account);
      console.log(data);
      if (data) setTradesData(data);
    }
  }, [account]);

  useEffect(() => {
    handleGetPendingTrades();
  }, [handleGetPendingTrades]);

  const handleConnect = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Install metamask extension in your browser");
      return;
    }
    try {
      await activate(Injected);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>PENDING WORK INFO</h1>
      {!account ? (
        <div className="center_content">
          <Button onClick={() => handleConnect()}>Connect wallet</Button>
        </div>
      ) : (
        <>
          {tradesData === null ? (
            <div className="center_content">
              <p>Loading...</p>
            </div>
          ) : !tradesData.length ? (
            <div className="center_content">
              <h3>No Pending jobs on your desk</h3>
            </div>
          ) : (
            <JobStatusCard pending={true} tradesData={tradesData} account={account} />
          )}
        </>
      )}
    </div>
  );
};

export default PendingProject;
