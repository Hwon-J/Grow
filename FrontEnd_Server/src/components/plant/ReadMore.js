import React from "react";

// 일정한 길이의 문자열만 보여주는 함수 (더보기를 누르면 전체 내용을 보여준다.)
const ReadMore = ({ content, maxLength }) => {
  // 현재 전체글인지를 확인하는 상태값
  const [isTruncated, setIsTruncated] = React.useState(true);

  const toggleTruncated = () => {
    setIsTruncated(!isTruncated);
  };

  // maxLength보다 긴 글이면 maxLength까지만 보여주고 더보기를 누를 수 있도록 한다.
  const renderTruncated = () => {
    return (
      <div style={{ fontSize:"23px", marginBottom:"30px"}}>
        {content.substring(0, maxLength)}...
        <span onClick={toggleTruncated} style={{ color: "blue", cursor: "pointer" }}>
          더 보기
        </span>
      </div>
    );
  };
  // 글 전체를 보여주고 있다면 접기를 누를 수 있도록 한다.
  const renderFull = () => {
    return (
      <div style={{ fontSize:"25px", marginBottom:"30px"}}>
        {content}
        <span onClick={toggleTruncated} style={{ color: "blue", cursor: "pointer" }}>
          접기
        </span>
      </div>
    );
  };

  return <>{isTruncated ? renderTruncated() : renderFull()}</>;
};

export default ReadMore;
