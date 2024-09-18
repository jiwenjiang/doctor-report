import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import loginBg from "@/static/imgs/login-bg.jpg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Notify, Picker } from "react-vant";
import styles from "./login.module.less";

function App() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [columns, setColumns] = useState([]);
  const [organization, setOrganization] = useState<any>({});

  const onFinish = async (values) => {
    const returnUrl = GetQueryString("returnUrl");
    if (!phone || !password || !organization.id) {
      Notify.show({ type: "warning", message: "请填写登录信息" });
    }
    const msg = await request({
      url: "/h5/login",
      data: { phone, password, organizationId: organization.id },
      method: "POST",
      needLogin: false,
    });
    if (msg.success) {
      localStorage.user = JSON.stringify(msg.data.user);
      localStorage.token = msg.data.token;
      // if (returnUrl) {
      //   window.location.href = returnUrl;
      // } else {
      navigate("/reportList");
      // }
    }
  };

  const searchOrg = async () => {
    if (phone) {
      const res = await request({
        url: "/user/phone/organizations",
        data: {
          phone,
        },
      });
      setColumns(res.data || []);
      console.log("🚀 ~ searchOrg ~ res:", res);
    }
  };

  const confirm = (_e, v) => {
    console.log("🚀 ~ confirm ~ e:", v);
    setOrganization(v);
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
              onBlur={(text) => searchOrg()}
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
          <div className={styles.label}>所属机构</div>
          <div className={styles.value}>
            <Picker
              popup={{
                round: true,
              }}
              value={organization.id}
              title="选择所属机构"
              columns={columns}
              onConfirm={confirm}
              columnsFieldNames={{ text: "name", value: "id" }}
            >
              {(val: string, _, actions) => {
                return (
                  <Input
                    value={organization.name}
                    onClick={() => actions.open()}
                    placeholder="请选择机构"
                    readOnly
                  />
                );
              }}
            </Picker>
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
