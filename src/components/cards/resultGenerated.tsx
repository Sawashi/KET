import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Typography } from "antd";
import { useEffect } from "react";
import { ResponseExam } from "src/apis/gemini";
import { AnswerStore, ExcelDataItem, SubmitDataItem } from "src/interfaces";

const { Title } = Typography;

interface ResultGeneratedProps {
  answerStore: AnswerStore[];
  convertedData: ExcelDataItem[];
  submitData: SubmitDataItem[];
}

const ResultGenerated: React.FC<ResultGeneratedProps> = (props) => {
  useEffect(() => {
    console.log(props.answerStore);
    console.log(props.convertedData);
    console.log(props.submitData);
  }, []);
  return (
    <Card
      style={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
        borderRadius: "8px", // Optional: Add border-radius for rounded corners
      }}
    >
      <Title level={3}>Result</Title>
      <Space direction="vertical">
        {props.answerStore.map((answer, index) => (
          <>
            <Title level={4}>
              {props.convertedData[index].order}
              {"/ "}
              {props.convertedData[index].typeOfKnowledge +
                " " +
                props.convertedData[index].topic}
            </Title>
            <Space direction="vertical">
              {answer.questionGenerated.map((question, index) => (
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
              ))}
            </Space>
          </>
        ))}
      </Space>
    </Card>
  );
};

export default ResultGenerated;
