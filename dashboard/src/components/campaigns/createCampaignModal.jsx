import React from "react";
import { Modal, Form, Radio, Input } from "antd";

const RadioGroup = Radio.Group;

const CreateCampaignModal = (props) => {
  const {
    visible,
    handleOk,
    handleCancel,
    name,
    type,
    constraints,
    url,
    reserve,
    handleChangeField
  } = props;

  return (
    <Modal visible={visible} onOk={handleOk} onCancel={handleCancel} title="Create campaign">
      <Form>
        <Form.Item label="Name">
          <Input value={name} onChange={handleChangeField} name="name" placeholder="Enter campaign name" />
        </Form.Item>
        <Form.Item label="Campaign type">
          <RadioGroup value={type} onChange={handleChangeField} name="type">
            <Radio value="clicks">Clicks</Radio>
            <Radio value="installs">Installs</Radio>
            <Radio value="views">Views</Radio>
          </RadioGroup>
        </Form.Item>
        {
          type === "clicks" && (
            <Form.Item label="Number of clicks">
              <Input value={constraints} onChange={handleChangeField} name="constraints" placeholder="Enter campaign name" />
            </Form.Item>
          )
        }
        <Form.Item label="Campaign url">
          <Input value={url} onChange={handleChangeField} name="url" placeholder="Enter campaign url" />
        </Form.Item>
        <Form.Item label="Reserve">
          <Input value={reserve} onChange={handleChangeField} name="reserve" placeholder="Enter reserve value for campaign" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateCampaignModal;
