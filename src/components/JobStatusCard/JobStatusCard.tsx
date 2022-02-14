import React, { useContext, useState } from "react";
import "./JobStatusCard.scss";
import profile from "../../assets/images/profile.png";
import { Button } from "..";
import { ProgressProps, TradeProps } from "../../store/types";
import { endTrade } from "../../utils/methods";
import { UserContext } from "../../store/UserContext";

interface JobStatusProps {
  pending: boolean;
  tradesData: TradeProps[];
  account: string;
}

const JobStatusCard: React.FC<JobStatusProps> = ({ pending, tradesData, account }) => {
  const { userData } = useContext(UserContext);
  const [progress, setProgress] = useState<ProgressProps>({
    loading: false,
    type: "loading",
    message: "",
  });

  const handleFinishTrade = async (id: string) => {
    if (userData?.userAccount?.toLocaleLowerCase() !== account.toLocaleLowerCase()) {
      alert(
        `connect your account to registered one.This wallet address is not registered.\n your Registered account is ${userData?.userAccount}`
      );
      return;
    }
    setProgress({
      loading: true,
      message: "Please wait your transaction is on progress...",
      type: "loading",
    });
    try {
      await endTrade(id, account);
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

  return (
    <>
      <div className="job_card_wrapper">
        {tradesData.map((data) => {
          return (
            <div className="job_card" key={data.id}>
              <div className="job_card_grid">
                <img src={profile} alt="avatar" width={40} height={40} className="avatar" />
                <div className="card_content">
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
                    {/* <p className="f-14 mt-10 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor, iaculis massa id
                faucibus quisque sed molestie parturient amet. Arcu pharetra nibh sed id orci, sed
                lorem enim. Libero eget ipsum lectus ac egestas sit. Malesuada amet, sed ut nisl.
              </p> */}
                    {/* {pending && (
                    <div className="mt-20">
                      <Button variant="secondary">Upload Files</Button>
                    </div>
                  )} */}
                  </div>
                  {pending && data.creator.toLocaleLowerCase() === account?.toLocaleLowerCase() && (
                    <div className="mt-30">
                      <Button
                        disabled={progress.loading}
                        onClick={() => handleFinishTrade(data.id)}
                      >
                        Finish Job
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

export default JobStatusCard;
