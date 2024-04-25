import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Table, Typography } from "antd";
import { ResponseExam } from "src/apis/gemini";

const { Title } = Typography;

interface ResultGeneratedProps {
  multipleChoiceArr: ResponseExam[];
}

const ResultGenerated: React.FC<ResultGeneratedProps> = (props) => {
  return (
    <Card
      style={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
        borderRadius: "8px", // Optional: Add border-radius for rounded corners
      }}
    >
      <Title level={3}>Result</Title>
      {props.multipleChoiceArr.map((item, index) => (
        <Card key={index}>
          <p>Question: {item.question}</p>
          <p>Options: {item.options.join(", ")}</p>
          <p>Answer: {item.answer}</p>
        </Card>
      ))}
    </Card>
  );
};

export default ResultGenerated;
