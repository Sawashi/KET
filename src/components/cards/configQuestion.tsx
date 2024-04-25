import { Button, Card, Input, Select, Table, Typography } from "antd";
import { ResponseExam } from "src/apis/gemini";
import { ExcelDataItem } from "src/interfaces";
import { generateExam } from "src/utils/common";
import { notification } from "antd";
const { Title } = Typography;

interface ConfigQuestionProps {
  convertedData: ExcelDataItem[];
  excelData: any[];
  multipleChoiceArr: ResponseExam[];
  setMultipleChoiceArr: (arr: ResponseExam[]) => void;
  questionTypes: string[];
  setQuestionTypes: (arr: string[]) => void;
  hints: string[];
  setHints: (arr: string[]) => void;
  submitData: SubmitDataItem[];
  setSubmitData: (arr: SubmitDataItem[]) => void;
  enableSpinnerResult: boolean;
  setEnableSpinnerResult: (value: boolean) => void;
}
export interface SubmitDataItem {
  order: number;
  topic: string;
  questionType: string;
  hint: string;
}
const ConfigQuestion: React.FC<ConfigQuestionProps> = (props) => {
  const dataSource = props.excelData.slice(1).map((row: any) => ({
    order: row[0],
    typeOfKnowledge: row[1],
    topic: row[2],
  }));
  const columnsCallApi = [
    { title: "Order", dataIndex: "order", key: "order" },
    {
      title: "Type of Knowledge",
      dataIndex: "typeOfKnowledge",
      key: "typeOfKnowledge",
    },
    { title: "Topic", dataIndex: "topic", key: "topic" },
    {
      title: "Type of question",
      dataIndex: "type",
      key: "type",
      render: (_text: any, _record: any, index: number) => (
        <Select
          onChange={(value) => {
            const newQuestionTypes = [...props.questionTypes];
            newQuestionTypes[index] = value;
            props.setQuestionTypes(newQuestionTypes);
          }}
          style={{ minWidth: "150px" }}
        >
          <Select.Option value="Multiple choices">
            Multiple choices
          </Select.Option>
          <Select.Option value="Paragraph">Paragraph</Select.Option>
          <Select.Option value="Fill in">Fill in</Select.Option>
        </Select>
      ),
    },
    {
      title: "Hint",
      dataIndex: "hint",
      key: "hint",
      render: (_text: any, _record: any, index: number) => (
        <Input
          onChange={(e) => {
            const newHints = [...props.hints];
            newHints[index] = e.target.value;
            props.setHints(newHints);
          }}
          style={{ minWidth: "150px" }}
        />
      ),
    },
  ];
  const handleSubmission = () => {
    props.setEnableSpinnerResult(true);
    // Iterate over dataSource to access each row
    const newData = dataSource.map((dataItem, index) => {
      // Extract data from each row
      const { order, topic } = dataItem; // These are common to all rows
      const questionType = props.questionTypes[index]; // Get the question type from state array
      const hint = props.hints[index]; // Get the hint from state array

      // Construct the object for the current row
      return { order, topic, questionType, hint };
    });

    // Update the submitData state with the new data
    props.setSubmitData(newData as unknown as SubmitDataItem[]); // Cast newData as unknown first, then as SubmitDataItem[][]
    const result = generateExam(
      props.convertedData,
      newData as unknown as SubmitDataItem[],
      [props.multipleChoiceArr, props.setMultipleChoiceArr]
    );
    props.setEnableSpinnerResult(false);
  };
  return (
    <Card
      style={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
        borderRadius: "8px", // Optional: Add border-radius for rounded corners
      }}
    >
      <Title level={3}>Config questions</Title>
      <Table dataSource={dataSource} columns={columnsCallApi} />
      <Button type="primary" onClick={handleSubmission}>
        Submit
      </Button>
    </Card>
  );
};

export default ConfigQuestion;
