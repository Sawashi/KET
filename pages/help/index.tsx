import YouTubePlayer from "@components/players";
import { Typography } from "antd";
const { Title } = Typography;
const HomeList: React.FC = () => {
  return (
    <div>
      <Title level={3}>Guide for using page</Title>
      <YouTubePlayer url={"https://youtu.be/0Hq5rbMnAPk"} />
    </div>
  );
};

export default HomeList;
