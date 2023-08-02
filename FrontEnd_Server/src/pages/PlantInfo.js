import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantInfoComponent from "../components/plant/PlantInfoComponent";
import { useNavigate } from "react-router-dom";
import { TextField, Grid, Container, Paper, Box } from "@mui/material";
import NavTop from "../components/NavTop";
import { styled } from "@mui/material/styles";
import "./plantinfo.css";
import { TbLeaf } from "react-icons/tb";
import { CiLock } from "react-icons/ci";
import { MdSend } from "react-icons/md";
import homevideo2 from "../assets/homevideo2.mp4";

const PlantInfo = () => {
  const [nickname, setNickname] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [checkedResult, setCheckedResult] = useState(false);
  const [plantInfo, setPlantInfo] = useState([]);
  const [checkIdx, setCheckIdx] = useState(-1);
  const navigate = useNavigate();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    getPlantInfo();
  }, []);

  useEffect(() => {
    imgPlantInfo();
  }, [plantInfo]);

  const onChangeNickname = (e) => {
    // 입력한 값 계속 바뀌는 것 확인
    setNickname(e.target.value);
  };

  const onChangeSerialNum = (e) => {
    setSerialNum(e.target.value);
  };

  const createPlant = async (e) => {
    e.preventDefault();
    if (checkedResult === false) {
      alert("시리얼 넘버를 확인해주세요");
    } else {
      // 데이터를 함께 보낼 객체를 생성 nickname, serialNum
      const data = {
        nickname: nickname,
        plant_info_index: checkIdx,
      };
      try {
        const response = await axios.post(
          `http://i9c103.p.ssafy.io:30001/api/plant/create`,
          data
        );
        navigate(`/diary/${response.data.index}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const imgPlantInfo = () => {
    return (
      <div className="image-container">
        {plantInfo.map((info, index) => (
          <div key={index} className="image-wrapper">
            <img
              className="plantinfoimg"
              src={`./plantinfoimg/${info.species}.jpg`}
              onClick={() => onClickInfo(info.index)}
              style={{
                border: checkIdx === info.index ? "2px solid black" : "none",
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const getPlantInfo = async () => {
    try {
      const response = await axios.get(
        `http://i9c103.p.ssafy.io:30001/api/plant/info`
      );
      setPlantInfo(response.data.info);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickInfo = (idx) => {
    setCheckIdx(idx);
  };

  const checkSerial = async () => {
    try {
      const response = await axios.get(
        `http://i9c103.p.ssafy.io:30001/api/pot/${serialNum}`
      );
      if (response.data.code === 202) {
        alert(response.data.message);
        setCheckedResult(false);
      }
      if (response.data.code === 200) {
        setCheckNum(response.data.message);
        setCheckedResult(true);
      }
    } catch (error) {
      alert.log("서버에러");
      setCheckedResult(false);
    }
  };

  return (
    <>
      <NavTop />
      <Container className="plantinfopage">
        <Grid container spacing={2}>
          <Grid item xs={4} md={2}>
            <Item>{imgPlantInfo()}</Item>
          </Grid>
          <Grid item xs={8} md={6}>
            <div className="itemclone">
              {checkIdx !== null && (
                <PlantInfoComponent
                  props={checkIdx !== -1 ? plantInfo[checkIdx - 1] : {}}
                />
              )}
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <div className="itemclone">
              <form onSubmit={createPlant}>
                <p>식물의 애칭</p>
                <TbLeaf />
                <input
                  className="nickname-input"
                  label="닉네임"
                  value={nickname}
                  onChange={onChangeNickname}
                />
                <hr />
                <p>시리얼 넘버 등록</p>
                <CiLock />
                <input 
                className="serial-input"
                value={serialNum} onChange={onChangeSerialNum} />
                
                <div className="check-serial-btn" onClick={checkSerial}>
                  중복체크<MdSend />
                </div>
                <div>
                  <p>{checkNum}</p>
                </div>
                <button className="w-btn-outline w-btn-indigo-outline" type="submit" variant="contained">
                  만들기
                </button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PlantInfo;

{
  /* <video autoPlay loop muted width="360" height="640">
<source src={homevideo2} type="video/mp4" />
</video> */
}
