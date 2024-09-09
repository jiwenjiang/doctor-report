import React, { useEffect, useState } from "react";
import { Button, Popup } from "react-vant";

import { UserO } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

function MineCenter() {
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const navigate = useNavigate();

  const open = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const logout = () => {
    localStorage.user = "";
    localStorage.token = "";
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.user) {
      setUserInfo(JSON.parse(localStorage.user));
    }
  }, []);

  return (
    <div>
      <UserO onClick={open} fontSize={20} />
      <Popup
        visible={visible}
        style={{ width: "50%", height: "100%" }}
        position="right"
        onClose={onClose}
      >
        <div className={styles.box}>
          <div className={styles.name}>{userInfo.name}</div>
          <div className={styles.org}>{userInfo.organizationName}</div>
          <Button
            type={
              userInfo.roleName === "ROLE_THERAPIST" ? "primary" : "default"
            }
            size="small"
          >
            智能评估
          </Button>
          <div style={{ marginTop: 20 }}>
            <Button type={"default"} onClick={logout} size="small">
              退出登录
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default MineCenter;
