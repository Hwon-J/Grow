import PlantCard from "../plant/plantCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "../../pages/Profile.css";
export function NotcompleteCardSet(growinPlant, slidesPerView, createCard) {
  // 진행중인 식물 컴포넌트
  return (
    <Swiper
      slidesPerView={slidesPerView} //페이지당 보여줄 slider개수
      spaceBetween={30} // 간격
      freeMode={true} // 슬라이드 간의 스무스한 이동을 가능
      pagination={{
        clickable: true, // 페이지 번호를 클릭해서 원하는 페이지로 이동 가능
      }}
      modules={[FreeMode, Pagination]} // 자유롭게 드래그, 슬라이더의 페이지 번호를 나타내는 역할
      className="mySwiper"
    >
      <div className="cardContainer">
        {growinPlant.map(
          (
            plant // 키우는 식물을 하나하나 뽑아서 PlantCard만들기
          ) => (
            <SwiperSlide key={plant.index}>
              <PlantCard props={plant} />
            </SwiperSlide>
          )
        )}
        <SwiperSlide>
          <div className="plantcard_new">
            <div className="new_register" onClick={createCard}>
              <h5 style={{ fontSize: "30px" }}>새 식물친구</h5>
              <h5 style={{ fontSize: "30px" }}>등록해주기</h5>
            </div>
          </div>
        </SwiperSlide>
      </div>
    </Swiper>
  );
}

export function completeCardSet(plantComplete, slidesPerView) {
  // 완료된 식물 보여줄 컴포넌트
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={20}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      className="mySwiper"
    >
      <div className="cardContainer">
        {plantComplete.map((plant) => (
          <SwiperSlide key={plant.index}>
            <PlantCard props={plant} />
          </SwiperSlide>
        ))}
      </div>
    </Swiper>
  );
}
