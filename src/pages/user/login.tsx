import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import logo from "@/static/imgs/logo.png";
import { Eye, Friends, Lock } from "@react-vant/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field, Form } from "react-vant";
import styles from "./login.module.less";

function App() {
  const [form] = Form.useForm();
  const [isPsw, setIsPsw] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const returnUrl = GetQueryString("returnUrl");
    const msg = await request({
      url: "/login",
      data: { ...values, openId: GetQueryString("openId") },
      method: "POST",
      needLogin: false,
    });
    if (msg.success) {
      sessionStorage.user = JSON.stringify(msg.data.user);
      sessionStorage.token = msg.data.token;
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        navigate("/records");
      }
    }
  };

  useEffect(() => {}, []);

  const changePsw = () => {
    setIsPsw(!isPsw);
  };
  return (
    <div className={styles.box}>
      <div className={styles.shadow}>
        <div className={styles.imgBox}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.title}>脑科学数字化精准康复变革者</div>
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "" }]}
            required={false}
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
        </Form>
        <div className={styles.rights}>
          Copyright © {new Date().getFullYear()} 复数健康
        </div>
      </div>
    </div>
  );
}

export default App;
