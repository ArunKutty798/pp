import React, { useContext } from "react";
import "./JobStatusCard.scss";
import profile from "../../assets/images/profile.png";
import { Button } from "..";
import { TradeProps } from "../../store/types";
import { endTrade } from "../../utils/methods";
import { UserContext } from "../../store/UserContext";

interface JobStatusProps {
  pending: boolean;
  tradesData: TradeProps[];
  account: string;
}

const JobStatusCard: React.FC<JobStatusProps> = ({ pending, tradesData, account }) => {
  const { userData } = useContext(UserContext);

  const handleFinishTrade = async (id: string) => {
    if (userData?.userAccount?.toLocaleLowerCase() !== account.toLocaleLowerCase()) {
      alert(
        `connect your account to registered one.This wallet address is not registered\n your Registered account is ${userData?.userAccount}`
      );
      return;
    }
    try {
      await endTrade(id, account);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
                  <h5>{data.title}</h5>
                  {/* <p className="f-14 mt-10 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor, iaculis massa id
                faucibus quisque sed molestie parturient amet. Arcu pharetra nibh sed id orci, sed
                lorem enim. Libero eget ipsum lectus ac egestas sit. Malesuada amet, sed ut nisl.
              </p> */}
                  {pending && (
                    <div className="mt-20">
                      <Button variant="secondary">Upload Files</Button>
                    </div>
                  )}
                </div>
                {pending && data.creator.toLocaleLowerCase() === account?.toLocaleLowerCase() && (
                  <div className="mt-30">
                    <Button onClick={() => handleFinishTrade(data.id)}>Finish Job</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobStatusCard;
