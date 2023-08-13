// 김태형
import React from "react";
import { Icon } from "@iconify/react";


// 질문등록 컴포넌트
const QuestItem = ({ questItem, handleListenAudio, deleteQuest }) => {
  return (
    <div className="quest-tm">
      <div className="quest-left">
        <p className="question">{questItem.content}</p>
        {questItem?.registered_date && (
          <p className="resister_date">
            {questItem.registered_date.slice(0, 10)}일 등록  
          </p>
        )}
      </div>
      <div className="quest-right">
        <Icon icon="bi:bell" onClick={() => handleListenAudio(28)} />
        {questItem.completed === 1 && (
          <Icon
            icon="bi:bell"
            onClick={() => handleListenAudio(questItem.index)}
          />
        )}
        <Icon icon="bi:trash3" onClick={() => deleteQuest(questItem.index)} />
      </div>
    </div>
  );
};

export default QuestItem;
