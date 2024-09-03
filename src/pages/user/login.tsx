import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import loginBg from "@/static/imgs/login-bg.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "react-vant";
import styles from "./login.module.less";

function App() {
  const [form] = Form.useForm();
  const [isPsw, setIsPsw] = useState(true);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    const returnUrl = GetQueryString("returnUrl");
    const msg = await request({
      url: "/login",
      data: { phone, password },
      method: "POST",
      needLogin: false,
    });
    if (msg.success) {
      localStorage.user = JSON.stringify(msg.data.user);
      localStorage.token = msg.data.token;
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        navigate("/reportList");
      }
    }
  };

  useEffect(() => {}, []);

  const changePsw = () => {
    setIsPsw(!isPsw);
  };
  return (
    <div className={styles.box}>
      <div className={styles.imgBox}>
        <img src={loginBg} alt="" />
      </div>
      <div className={styles.shadow}>
        <div className="form-box">
          <div className={styles.label}>用户名</div>
          <div className={styles.value}>
            <Input
              value={phone}
              onChange={(text) => setPhone(text)}
              placeholder="请输入用户名"
              clearable
            />
          </div>
          <div className={styles.label}>密码</div>
          <div className={styles.value}>
            <Input
              value={password}
              type="password"
              onChange={(text) => setPassword(text)}
              placeholder="请输入密码"
              clearable
            />
          </div>
          {/* <div className={styles.label}>密码</div>
          <div className={styles.value}>
            <Input
              value={password}
              type="password"
              onChange={(text) => setPassword(text)}
              placeholder="请输入密码"
              clearable
            />
          </div> */}
          <div className="btn" style={{ marginTop: 30 }} onClick={onFinish}>
            登录
          </div>
        </div>
        {/* <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "" }]}
            required={false}
            label="用户名"
          >
            <Field placeholder="请输入用户名" leftIcon={<Friends />} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "" }]}
            required={false}
          >
            <Field
              placeholder="请输入密码"
              leftIcon={<Lock />}
              rightIcon={<Eye />}
              onClickRightIcon={changePsw}
              type={isPsw ? "password" : "text"}
            />
          </Form.Item>
          <Button
            nativeType="submit"
            className={styles.btn}
            type="primary"
            block
          >
            登录
          </Button>
        </Form> */}
      </div>
    </div>
  );
}

export default App;
