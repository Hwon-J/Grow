import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
// date-fns 라이브러리를 사용해서 날짜를 계산에 필요한 부분을 불러온다
// format: 날짜를 원하는 형식으로 변환
// addMonths: 월을 더한다
// subMonths: 월을 뺀다
// startOfMonth: 월의 시작일
// endOfMonth: 월의 마지막일
// startOfWeek: 주의 시작일
// endOfWeek: 주의 마지막일
// isSameMonth: 같은 달인지 확인
// isSameDay: 같은 날인지 확인
// addDays: 일을 더한다
// parse: 문자열을 날짜로 변환
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import './Calendar.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';

// 달력을 만들때 연월을 표기하고 월을 이동하는 RenderHeader
// 각각의 요일을 표기하는 RenderDays
// 날짜를 표기하고 날짜를 클릭하면 선택되는 RenderCells


const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };


// Calender 컴포넌트에서 currentMonth, prevMonth, nextMonth를 가져와 사용한다.
// format을 사용해 원하는 형태로 출력한다.
const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    
    return (
        <div className="header_cal">
            <Icon icon="bi:chevron-left" onClick={prevMonth} />
                <span className="mon_yr">
                    <span className="month">
                        {format(currentMonth, 'LLLL')}
                    </span>
                    <span className="year">
                        {format(currentMonth, 'yyyy')}
                    </span>  
                </span> 
            <Icon icon="bi:chevron-right" onClick={nextMonth} />
        </div>
    );
};


// 요일을 표기하는 RenderDays
// 각각의 요일을 하나의 div로 만들어 표시하기 위해서 for문을 사용한다.
const RenderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // for문을 사용하여 요일을 배열에 추가한다.
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col_day" key={i}>
                {date[i]}
            </div>,
        );
    }

    return <div className="days_cal">{days}</div>;
};

// 각각의 날짜를 표기하는 RenderCells
const RenderCells = ({ currentMonth, currentDate, formattedWaterLog }) => {
    // 현재의 월의 첫날과 마지막날, 첫주의 첫날(이전달)과 마지막주의 마지막날(다음달)을 구한다.
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    // console.log(currentDate);
    
    // 주(rows)와 날짜(days)를 담을 배열을 만든다.0
    const rows = [];
    let days = [];
    // day 변수에 startDate를 할당, day는 반복문에서 사용될 변수이다.
    let day = startDate;
    // 날짜의 형식을 지정한 문자열을 담을 변수 formattedDate를 생성
    let formattedDate = '';

    // 각 주마다 반복문을 실행하여 날짜들을 처리
    while (day <= endDate) {
        // 날짜의 형식을 지정한 문자열을 formattedDate에 할당
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            // const isWatered = formattedWaterLog.
            const isWatered = formattedWaterLog.includes(formatDate(day));
            
            days.push(
                <div
                    className={`cell_col ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : isSameDay(day, currentDate)
                            ? 'text current-day'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'not-valid'
                            : 'valid'
                            
                    } ${isWatered ? 'watered' : ''}`}
                    key={day}
                >
                     
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                            : ''
                        }
                    >
                        {formattedDate}
                    </span>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row_cell" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body_cell">{rows}</div>;
};

// PlantDiary.js에서 사용할 Calender 컴포넌트
const Calender = () => {
    // useState(new Date())를 통해 현재 날짜와 시간을 초기값으로 저장합니다.
    // currentMonth, selectedDate, currentDate만든다.
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [waterLog, setWaterLog] = useState([]);
    const { id } = useParams();
    // console.log(id);

    // prevMonth, nextMonth를 만들어 버튼 클릭시 원하는 달로 이동하도록 설정한다.
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    
    //const formattedWaterLog = useMemo(() => waterLog.water_log.data.map(formatDate), []);

    const currentUser = useSelector((state) => state.currentUser);
    const token = currentUser.token;

    const config = {
        headers: {
          Authorization: token, 
        },
      };
    
      
//http://i9c103.p.ssafy.io:30001/api/plant/water/${id}
//http://192.168.100.37:30001/api/plant/water/${id}

    
    const getWaterLog = async () => {
        try {
        const response = await axios.get(`http://i9c103.p.ssafy.io:30001/api/plant/water/${id}`, config);
            // console.log(response.data);
            setWaterLog(response.data);
            // console.log(waterLog.data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        getWaterLog();
    }, []);
    const formattedWaterLog = useMemo(
        () => (waterLog.data ? waterLog.data.map(formatDate) : []),
        [waterLog]
      );
    // console.log(formattedWaterLog);      

    // RenderHeader, RenderDays, RenderCells를 렌더링한다.
    return (
        <div className="calendar">
            <RenderHeader
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <RenderDays />
            <RenderCells
                currentMonth={currentMonth}
                currentDate={currentDate}
                formattedWaterLog={formattedWaterLog}
                // waterLog={waterLog}
            />
        </div>
    );
};

export default Calender;