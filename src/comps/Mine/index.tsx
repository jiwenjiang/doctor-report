import React, { useEffect, useState } from "react";
import { Button, Picker, Popup } from "react-vant";

import request from "@/service/request";
import { UserO } from "@react-vant/icons";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";

function MineCenter({ reload }: { reload: Function }) {
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [org, setOrg] = useState<any>({});
  const navigate = useNavigate();
  const location = useLocation();
  const [columns, setColumns] = useState([]);

  const open = () => {
    getInfo();
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const getInfo = async () => {
    const res = await request({ url: "/doctor/get" });
    setOrg(res.data);
    changeOrg(res.data);
    console.log("🚀 ~ getInfo ~ res:", res);
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

  const changeOrg = async (data) => {
    const res = await request({
      url: "/user/phone/organizations",
      data: {
        phone: data.phone,
      },
    });
    setColumns(res.data || []);
  };

  const confirm = async (v) => {
    const res = await request({
      url: "/user/organization/change",
      data: {
        organizationId: v,
      },
    });
    console.log("🚀 ~ confirm ~ res:", res);
    localStorage.user = JSON.stringify(res.data.user);
    localStorage.token = res.data.token;
    setOrg(res.data.user);
    reload?.();
  };

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
          <div className={styles.org}>
            {org.organizationName || userInfo.organizationName}
          </div>
          <div>
            <Button
              type={location.pathname === "/reportList" ? "primary" : "default"}
              size="small"
              onClick={() => navigate("/reportList")}
            >
              智能评估
            </Button>
          </div>
          <div style={{ marginTop: 15 }}>
            {userInfo.roleName === "ROLE_DOCTOR" && (
              <Button
                type={
                  location.pathname === "/orderList" ? "primary" : "default"
                }
                size="small"
                onClick={() => navigate("/orderList")}
              >
                订单管理
              </Button>
            )}
          </div>
          {userInfo.roleName === "ROLE_THERAPIST" && (
            <div style={{ marginTop: 20 }}>
              <Picker
                popup={{
                  round: true,
                }}
                value={org.organizationId}
                title="选择所属机构"
                columns={columns}
                onConfirm={confirm}
                columnsFieldNames={{ text: "name", value: "id" }}
              >
                {(val: string, _, actions) => {
                  return (
                    <Button
                      type={"default"}
                      onClick={() => actions.open()}
                      size="small"
                    >
                      切换机构
                    </Button>
                  );
                }}
              </Picker>
            </div>
          )}
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
