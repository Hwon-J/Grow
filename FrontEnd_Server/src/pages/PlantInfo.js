//김태형
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import NavTop from "../components/NavTop";
import PlantInfoComponent from "../components/plant/PlantInfoComponent";
import "./plantinfo.scss";

import { styled } from "@mui/material/styles";
import { TextField, Grid, Container, Paper, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";


const PlantInfo = () => {
  const [nickname, setNickname] = useState("");
  const [childname, setChildname] = useState("");
  const [childage, setChildage] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [checkedResult, setCheckedResult] = useState(false);
  const [plantInfo, setPlantInfo] = useState([]);
  const [checkIdx, setCheckIdx] = useState(-1);
  const [errormessage, setErormessage] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
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
  const onChangeChildname = (e) => {
    setChildname(e.target.value);
  };
  const onChangeChildage = (e) => {
    setChildage(e.target.value);
  };

  const createPlant = async (e) => {
    e.preventDefault();
    console.log("여기");
    if (checkedResult === false) {
      alert("시리얼 넘버를 확인해주세요");
    } else {
      const body = {
        plant_name: nickname,
        plant_info_index: checkIdx,
        serial_number: serialNum,
        child_name: childname,
        child_age: childage,
      };
      console.log(authToken)
      const config = {
        headers: {
          Authorization: `${authToken}`,
        },
      };
  
      console.log(config);
  
      try {
        const response = await axios.post(
          // `http://i9c103.p.ssafy.io:30001/api/plant/create`,
          `http://192.168.100.37:30001/api/plant/create`,
          body, // body는 요청 바디에 해당하는 부분이므로 여기에 body를 넣어줍니다.
          config // config는 옵션 객체이며, 여기에 headers를 포함하여 설정을 넣어줍니다.
        );
        navigate(`/diary/${response.data.index}`);
      } catch (error) {
        console.log(error.message);
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
                border: checkIdx === info.index ? "0.1rem solid rgb(56, 181, 203)" : "none",
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
    if (serialNum) {
      try {
        const response = await axios.get(
          `http://i9c103.p.ssafy.io:30001/api/pot/${serialNum}`
        );
        if (response.data.code === 202) {
          // alert(response.data.message);
          console.log(response.data.message);
          setCheckedResult(false);
          setErormessage(response.data.message);
          setCheckNum("")
        }
        if (response.data.code === 200) {
          setCheckNum(response.data.message);
          setErormessage("")
          console.log(response.data.message);
          setCheckedResult(true);
        }
      } catch (error) {
        alert.log("서버에러");
        setCheckedResult(false);
      }
    } else {
      alert("시리얼 넘버를 입력해 주세요!")
    }
  };

  return (
    <div className="plantinfo-total">
      <NavTop />
      <Container className="plantinfopage">
        <Grid container spacing={2}>
          <Grid className="each-components" item xs={12} md={2}>
            <Item>{imgPlantInfo()}</Item>
          </Grid>
          <Grid className="each-components" item xs={12} md={5}>
            <div className="itemclone">
              {checkIdx !== null && (
                <PlantInfoComponent
                  props={checkIdx !== -1 ? plantInfo[checkIdx - 1] : {}}
                  key={checkIdx !== -1 ? plantInfo[checkIdx - 1] : {}}
                />
              )}
            </div>
          </Grid>
          <Grid className="each-components" item xs={12} md={4}>
            <div className="itemclone">
              <form onSubmit={createPlant}>
                <Grid justifyContent="center" alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      label="식물의 애칭"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      value={nickname}
                      onChange={onChangeNickname}
                    />
                  </Grid>

                  <hr />

                  <Grid item xs={12}>
                    <TextField
                      label="시리얼넘버"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      value={serialNum}
                      onChange={onChangeSerialNum}
                    />
                  </Grid>
                  <br />
                  <p className="checkP" style={{ color: "red" }}>
                    {checkNum ? checkNum : errormessage}
                  </p>

                  <Grid item xs={12}>
                    <button 
                    type="button"
                      className="w-btn-indigo-outline"
                      onClick={checkSerial}
                    >
                      중복체크
                    </button>
                  </Grid>
                </Grid>
                <hr />
                <Grid item xs={12}>
                  <TextField
                    label="아이의 이름"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={childname}
                    onChange={onChangeChildname}
                  />
                </Grid>

                <Box className="childageBox">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">나이</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={childage}
                      label="Age"
                      onChange={onChangeChildage}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={11}>11</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={13}>13</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <hr />

                <button
                  className="w-btn-outline w-btn-indigo-outline"
                  type="submit"
                  variant="contained"
                >
                  만들기
                </button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default PlantInfo;

{
  /* <video autoPlay loop muted width="360" height="640">
<source src={homevideo2} type="video/mp4" />
</video> */
}
