import React from "react";
import { Button, Form, Input, Popup, Radio } from "react-vant";
import styles from "./audit.module.less";

export default function App({ show, onClose, onConfirm }) {
  const [form] = Form.useForm();
  const result = Form.useWatch("result", form);
  console.log("🚀 ~ App ~ result:", result);

  const onclose = () => {
    form.resetFields()
    onClose?.();
  };

  const onFinish = async () => {
    const res = await form.validateFields();
    console.log("🚀 ~ onFinish ~ res:", res);
    onConfirm?.({
      ...res,
      result: res.result === "0" ? false : true,
    });
  };

  return (
    <div className={styles.box}>
      <Popup
        visible={show}
        destroyOnClose
        position="bottom"
        closeable
        style={{ height: "40%" }}
        onClose={() => onclose()}
        title="审核"
      >
        <Form
          colon
          layout="vertical"
          form={form}
          onFinish={onFinish}
          footer={
            <div style={{ margin: "16px 16px 0" }}>
              <Button round nativeType="submit" type="primary" block>
                保存
              </Button>
            </div>
          }
        >
          <Form.Item
            name="result"
            label="审核结果"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Radio.Group direction="horizontal">
              <Radio name="1" value={true}>
                通过
              </Radio>
              <Radio name="0" value={false}>
                驳回
              </Radio>
            </Radio.Group>
          </Form.Item>
          {result === "0" && (
            <Form.Item
              isLink
              name="remark"
              label="驳回原因"
              rules={[{ required: true, message: "请输入" }]}
            >
              <Input placeholder="请输入驳回原因" />
            </Form.Item>
          )}
        </Form>
      </Popup>
    </div>
  );
}
