import PlantCard from "../plant/plantCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "../../pages/Profile.css";
import { Icon } from '@iconify/react';

export function NotcompleteCardSet(growinPlant, slidesPerView, createCard) {
  //관리중인 식물 보여줄 컴포넌트

  // swiper slide를 움직일 버튼  
  const slidePrev = () => {
    const swiper = document.querySelector('.mySwiper').swiper;
    swiper.slidePrev();
  }

  const slideNext = () => {
    const swiper = document.querySelector('.mySwiper').swiper;
    swiper.slideNext();
  }

  // 버튼 클릭을 통해 식물카드를 움직일 수 있다.
  return (
    <div className="swiper_total">
      <div className="swiper-button-prev" onClick={slidePrev}>
          <Icon icon="bi:chevron-left" />
      </div>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={30}
        className="mySwiper"
      >
        <div className="cardContainer">
          {growinPlant.map((plant) => (
            <SwiperSlide key={plant.index}>
              {/* {PlantCard 컴포넌트로 props를 사용해 plant 정보를 넘겨준다.} */}
              <PlantCard props={plant} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <div className="plantcard_new" onClick={createCard} style={{cursor:"pointer"}}>
              <div className="new_register">
              <h5 style={{ fontSize: "28px" }}>새 식물친구</h5>
              <h5 style={{ fontSize: "28px" }}>등록해주기</h5>
              </div>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
      <div className="swiper-button-next" onClick={slideNext}>
        <Icon icon="bi:chevron-right" />
      </div>
    </div>
  );
}

export function completeCardSet(plantComplete, slidesPerView) {
  // 완료된 식물 보여줄 컴포넌트

  // swiper slide를 움직일 버튼  
  const slidePrev = () => {
    const swiper = document.querySelector('.mySwiper').swiper;
    swiper.slidePrev();
  }

  const slideNext = () => {
    const swiper = document.querySelector('.mySwiper').swiper;
    swiper.slideNext();
  }

  return (
    <div className="swiper_total">
      <div className="swiper-button-prev" onClick={slidePrev}>
          <Icon icon="bi:chevron-left" />
      </div>
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
    <div className="swiper-button-next" onClick={slideNext}>
        <Icon icon="bi:chevron-right" />
      </div>
    </div>
  );
}
