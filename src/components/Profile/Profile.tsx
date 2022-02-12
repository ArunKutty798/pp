import React, { useCallback, useContext, useEffect } from "react";

import "./Profile.scss";
import logo from "../../assets/abstracts/logo.png";
import profile from "../../assets/images/profile.png";
// import { ReactComponent as Recent } from "../../assets/icons/recent.svg";
import { ReactComponent as Pending } from "../../assets/icons/pending.svg";
import { ReactComponent as Complete } from "../../assets/icons/complete.svg";
import { ReactComponent as Hire } from "../../assets/icons/hire.svg";
import { Link } from "react-router-dom";
import { Button } from "..";
import jwtDecode from "jwt-decode";
import { getUserApi } from "../../api";
import { UserContext } from "../../store/UserContext";

interface ProfileProps {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile: React.FC<ProfileProps> = ({ openSidebar, setOpenSidebar }) => {
  const { userData, setUserData } = useContext(UserContext);
  const handleGetUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const jwtData: any = jwtDecode(token);
        const { data } = await getUserApi(jwtData?.id);
        setUserData({
          id: data._id,
          userAccount: data.account,
          email: data.email,
          username: data.username,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [setUserData]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  const renderUserProfile = (
    <>
      {userData && (
        <div className="userProfile mb-30">
          <img src={profile} alt="avatar" className="avatar mb-20" />
          <div>
            <h2 className="mb-10">{userData.username}</h2>
            <p className="mb-20 f-14">{userData.email}</p>
            <p className="f-12">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor, iaculis massa id
              faucibus quisque sed molestie parturient amet.
            </p>
          </div>
        </div>
      )}
    </>
  );

  const renderUserLinks = (
    <div className="userlinks">
      <Link to="/" className="profile_link">
        <Hire />
        <span>Hire for the job </span>
      </Link>
      <Link to="/pending-project" className="profile_link">
        <Pending />
        <span>Pending work info </span>
      </Link>
      <Link to="/completed-project" className="profile_link">
        <Complete />
        <span>Completed job </span>
      </Link>
      <Button>Report issues</Button>
    </div>
  );

  return (
    <>
      <div className={openSidebar ? "profile_container active" : "profile_container"}>
        <div className="profile_container_logo">
          <img src={logo} alt="logo" width={150} />
        </div>
        <div className="p-30">
          {renderUserProfile}
          {renderUserLinks}
        </div>
      </div>
      <div
        className={openSidebar ? "backdrop active" : "backdrop"}
        onClick={() => setOpenSidebar(false)}
      ></div>
    </>
  );
};

export default Profile;
