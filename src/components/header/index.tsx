import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  Typography,
  theme,
  Row,
  Col,
} from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts";

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { mode, toggleMode } = useContext(ColorModeContext);

  return (
    <AntdLayout.Header>
      <Row justify="end">
        <Col>
          <Space>
            <Switch
              checkedChildren="🔆"
              unCheckedChildren="🌛"
              checked={mode === "light"}
              onChange={toggleMode}
            />
          </Space>
        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
