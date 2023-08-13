//김태형
import React, { useEffect, useState } from "react";
import Withdrawal from "../components/Withdrawal";
import NavTop from "../components/NavTop";
import {
  NotcompleteCardSet,
  completeCardSet,
} from "../components/profile/CardSet";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./Profile.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { getPlants, withdrawal } from "../utils/ProfileUtils";
import { logoutUser } from "../reducers/userSlice";

const Profile = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [slidesPerView, setSlidesPerView] = useState(4); //슬라이드 갯수 조정

  const calculateSlidesPerView = () => {
    // 화면당 슬라이드 보여줄 개수 조정
    const width = window.innerWidth;
    if (width >= 1200) {
      setSlidesPerView(4);
    } else if (width >= 1000) {
      setSlidesPerView(3);
    } else if (width >= 770) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(2);
    }
  };

  useEffect(() => {
    calculateSlidesPerView();
    window.addEventListener("resize", calculateSlidesPerView);
    return () => {
      window.removeEventListener("resize", calculateSlidesPerView);
    };
  }, []);

  const [showInProgress, setShowInProgress] = useState(true); // 보여줄 식물 목록 확인 변수
  const [growinPlant, setGrowinPlant] = useState([]); //  키우는 식물 리스트
  const [plantComplete, setPlantComplete] = useState([]); //  완료된 식물 리스트

  useEffect(() => {
    async function fetchData() {
      // axios요청으로 식물 받아오고 키우는 식물, 완료된 식물 변수에 저장
      const { growing, complete } = await getPlants(token);
      setGrowinPlant(growing);
      setPlantComplete(complete);
    }
    fetchData();
  }, [token]); // token이 변경될 때마다 데이터를 가져와서 변경

  const handleWithdrawal = async () => {
    // 회원탈퇴 요청
    const result = await withdrawal(token); // 요청이 오류없이 완료되면 로그아웃 후 회원가입 페이지로 이동
    if (result) {
      dispatch(logoutUser());
      navigate("/signup");
    }
  };

  const createCard = () => {
    // 식물등록 버튼 누르면 등록페이지로 이동
    navigate("/plantinfo");
  };

  return (
    <>
      <NavTop />
      <div className="top_section">
        <h1 style={{ fontSize: "80px" }}>나의 식물 목록</h1>
      </div>
      <div className="profilepage container">
        <div className="profile-row">
          <div className="container profile row">
            <div className="button-container">
              <div className="btn-left">
                <div
                  className={`plant-btn${showInProgress ? " selected" : ""}`}
                  onClick={() => setShowInProgress(true)}
                >
                  관리중인 식물
                </div>

                <div
                  className={`plant-btn${!showInProgress ? " selected" : ""}`}
                  onClick={() => setShowInProgress(false)}
                >
                  완료된 식물
                </div>
              </div>
              <Withdrawal withdrawal={handleWithdrawal}>회원탈퇴</Withdrawal>
            </div>

            <div className="container plant">
              {showInProgress && ( // 진행중인 식물 클릭시 NotcompleteCardSet컴포넌트 보여주기
                <div className="plant-ing">
                  {NotcompleteCardSet(growinPlant, slidesPerView, createCard)}
                </div>
              )}
              {!showInProgress && ( // 완료된 식물 클릭시 completeCardSet컴포넌트 보여주기
                <div className="plant-complete">
                  {completeCardSet(plantComplete, slidesPerView)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
