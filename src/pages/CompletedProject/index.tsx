import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useState } from "react";
import { Button, JobStatusCard } from "../../components";
import { TradeProps } from "../../store/types";
import { Injected } from "../../utils/connector";
import { getCompletedTrades } from "../../utils/methods";

const CompletedProject: React.FC = () => {
  const { activate, account } = useWeb3React();
  const [tradesData, setTradesData] = useState<TradeProps[] | null>(null);

  const handleGetCompletedTrades = useCallback(async () => {
    if (account) {
      const data: TradeProps[] | undefined = await getCompletedTrades(account);
      console.log(data);
      if (data) setTradesData(data);
    }
  }, [account]);

  useEffect(() => {
    handleGetCompletedTrades();
  }, [handleGetCompletedTrades]);

  const handleConnect = async () => {
    try {
      await activate(Injected);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>COMPLETED JOB</h1>
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
              <h3>No Jobs completed yet</h3>
            </div>
          ) : (
            <JobStatusCard pending={false} tradesData={tradesData} account={account} />
          )}
        </>
      )}
    </div>
  );
};

export default CompletedProject;
