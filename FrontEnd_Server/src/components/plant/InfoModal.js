import React from "react";
import styles from "./infomodal.module.css";
const InfoModal = ({ setModalOpen, selectedInfo }) => {
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <button className={styles.close} onClick={closeModal}>
          X
        </button>
        <div>
          {selectedInfo?.species && <h1>{selectedInfo.species}</h1>}
          {selectedInfo?.info && <p> {selectedInfo.info}</p>}
          {(selectedInfo?.temperature_upper ||
            selectedInfo?.temperature_upper === 0) && (
            <p>최고온도: {selectedInfo.temperature_upper}도</p>
          )}

          {(selectedInfo?.temperature_lower ||
            selectedInfo?.temperature_lower === 0) && (
            <p>최저온도: {selectedInfo.temperature_lower}도</p>
          )}
          {(selectedInfo?.moisture_upper ||
            selectedInfo?.moisture_upper === 0) && (
            <p>최고습도: {selectedInfo.moisture_upper}%</p>
          )}
          {(selectedInfo?.moisture_lower ||
            selectedInfo?.moisture_lower === 0) && (
            <p>최저습도: {selectedInfo.moisture_lower}%</p>
          )}
          {(selectedInfo?.max_water_period ||
            selectedInfo?.max_water_period === 0) && (
            <p>최대 물주기: {selectedInfo.max_water_period}일</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoModal;
