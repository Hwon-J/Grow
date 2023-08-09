import React from "react";

const ReadMore = ({ content, maxLength }) => {
  const [isTruncated, setIsTruncated] = React.useState(true);

  const toggleTruncated = () => {
    setIsTruncated(!isTruncated);
  };

  const renderTruncated = () => {
    return (
      <div style={{ fontSize:"25px", marginBottom:"30px"}}>
        {content.substring(0, maxLength)}...
        <span onClick={toggleTruncated} style={{ color: "green", cursor: "pointer" }}>
          더 보기
        </span>
      </div>
    );
  };

  const renderFull = () => {
    return (
      <div style={{ fontSize:"25px", marginBottom:"30px"}}>
        {content}
        <span onClick={toggleTruncated} style={{ color: "green", cursor: "pointer" }}>
          접기
        </span>
      </div>
    );
  };

  return <>{isTruncated ? renderTruncated() : renderFull()}</>;
};

export default ReadMore;
