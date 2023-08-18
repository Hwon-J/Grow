// 장혜원

  // 페이지네이션 함수
const renderPagination = ({questList, currentPage, Icon, handlePageChange}) => {
    // 페이지당 질문 5개
    const itemsPerPage = 5;
    const totalPages = questList.length ? Math.ceil(questList.length / itemsPerPage) : 1;
    console.log(totalPages, "토탈페이지")


    // 현재 페이지가 1이면 이전버튼 비활성화
    // 현재 페이지가 마지막 페이지면 다음버튼 비활성화
    return (
      <div className="pagination">
        {currentPage === 1 && (
          <Icon
            icon="bi:chevron-left"
            style={{ marginRight: "10px", marginTop: "3px", color: "white" }}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}

        {currentPage !== 1 && (
          <Icon
            icon="bi:chevron-left"
            style={{ marginRight: "10px", marginTop: "3px", color: "black" }}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}

        <span>{`${currentPage} / ${totalPages}`}</span>

        {currentPage === totalPages && (
          <Icon
            icon="bi:chevron-right"
            style={{ marginLeft: "10px", marginTop: "3px", color: "white" }}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )}

        {currentPage !== totalPages && (
          <Icon
            icon="bi:chevron-right"
            style={{ marginLeft: "10px", marginTop: "3px", color: "black" }}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )}
      </div>
    );
  };
export default renderPagination