import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { ResponseExam } from "src/apis/gemini";
import {
  AnswerStore,
  AugmentedAnswerStoreItem,
  ExcelDataItem,
  GroupedDataItem,
  SubmitDataItem,
  TypeOfKnowledgeWithOrders,
} from "src/interfaces";

const { Title } = Typography;

interface ResultGeneratedProps {
  answerStore: AnswerStore[];
  convertedData: ExcelDataItem[];
  submitData: SubmitDataItem[];
}

const ResultGenerated: React.FC<ResultGeneratedProps> = (props) => {
  const augmentAnswerStore = (
    answerStore: AnswerStore[],
    convertedData: ExcelDataItem[],
    submitData: SubmitDataItem[]
  ): AugmentedAnswerStoreItem[] => {
    return answerStore.map((item) => {
      const matchingData = convertedData.find(
        (data) => data.order === parseInt(item.order)
      );
      if (matchingData) {
        const matchingSubmitData = submitData.find(
          (submit) =>
            submit.order === parseInt(item.order) &&
            submit.topic === matchingData.topic
        );
        if (matchingSubmitData) {
          return {
            ...item,
            typeOfKnowledge: matchingData.typeOfKnowledge,
            topic: matchingData.topic,
            questionType: matchingSubmitData.questionType,
          };
        }
      }
      // Handle the case where no matching data is found (optional)
      return {
        ...item,
        typeOfKnowledge: "Unknown",
        topic: "Unknown",
        questionType: "Unknown",
      };
    });
  };

  // Usage example
  const augmentedAnswerStore: AugmentedAnswerStoreItem[] = augmentAnswerStore(
    props.answerStore,
    props.convertedData,
    props.submitData
  );
  const renderQuestions = (questions: ResponseExam[]) => {
    return questions.map((question, index) => (
      <div>
        <div>
          Question {index + 1}: {question.question}
        </div>
        <Space>
          {question.options.map((option, index) => (
            <div>
              {String.fromCharCode(65 + index)}. {option}
            </div>
          ))}
        </Space>
        <br />
        <Space>
          <b>Answer:</b>
          {question.answer}
        </Space>
      </div>
    ));
  };
  useEffect(() => {
    console.log(JSON.stringify(props.answerStore));
    console.log(JSON.stringify(props.convertedData));
    console.log(augmentedAnswerStore);
    console.log(JSON.stringify(props.submitData));
  }, []);
  let currentTypeOfKnowledge = "";
  return (
    <Card
      style={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
        borderRadius: "8px", // Optional: Add border-radius for rounded corners
      }}
    >
      <Title level={3}>Result</Title>
      {augmentedAnswerStore.map((item, index) => {
        const isNewTypeOfKnowledge =
          item.typeOfKnowledge !== currentTypeOfKnowledge;
        currentTypeOfKnowledge = item.typeOfKnowledge;
        return (
          <div key={index}>
            {isNewTypeOfKnowledge && (
              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {item.typeOfKnowledge}
              </div>
            )}
            {item.topic && (
              <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                {item.topic}
              </div>
            )}
            {renderQuestions(item.questionGenerated)}
          </div>
        );
      })}
    </Card>
  );
};

export default ResultGenerated;
