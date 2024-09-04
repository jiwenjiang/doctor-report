import VList from "@/comps/VList";
import { reportEnum } from "@/service/const";
import request from "@/service/request";
import { findItem } from "@/service/utils";
import female from "@/static/imgs/female.png";
import male from "@/static/imgs/male.png";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, Search, Tabs } from "react-vant";
import styles from "./list.module.less";

const tabData = [
  {
    label: "未评估",
    value: 1,
  },
  {
    label: "待审核",
    value: 13,
  },
  {
    label: "待发送",
    value: 15,
  },
  {
    label: "已发送",
    value: 3,
  },
  {
    label: "全部",
    value: 0,
  },
];

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const total = useRef(1);
  const params = useRef({ pageNo: 1, pageSize: 10, patientId: null });
  const [condition, setCondition] = useState({
    status:
      localStorage.user &&
      JSON.parse(localStorage.user)?.roleName === "ROLE_DOCTOR"
        ? 15
        : 1,
    word: "",
  });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");
  const navigate = useNavigate();

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    }
  };

  const getList = async (init?: boolean, extendParams = {}) => {
    const res = await request({
      url: "/scale/record/list",
      data: { ...params.current, ...condition, ...extendParams },
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.records : [...data, ...res.data?.records]);
    isLoading.current = false;
  };

  useEffect(() => {
    if (localStorage.user) {
      const user = JSON.parse(localStorage.user);

      params.current.patientId = user.id;
      getList(true);
    } else {
      navigate("/login");
    }
  }, [condition]);

  const cb = async (data) => {
    navigate(`/reportDetail?id=${data.id}&editable=1`);
  };

  const toReport = async (v) => {
    navigate(`/report/${v.id}`);
  };

  const search = () => {
    setCondition({ ...condition, word: keyword });
  };

  const changeTab = (e) => {
    setCondition({ ...condition, status: e });
  };

  const searchChange = (e) => {
    console.log("🚀 ~ searchChange ~ e:", e);
    setKeyword(e);
  };

  return (
    <div className={styles.box}>
      <NavBar title="报告列表" onClickLeft={() => window.history.back()} />
      <Search
        showAction
        action={
          <div onClick={() => search()} className={styles.searchTxt}>
            搜索
          </div>
        }
        value={keyword}
        onChange={searchChange}
        placeholder="请输入搜索关键词"
      />
      <Tabs active={condition.status} onChange={changeTab}>
        {tabData.map((item) => (
          <Tabs.TabPane
            key={item.value}
            name={item.value}
            title={item.label}
          ></Tabs.TabPane>
        ))}
      </Tabs>
      <div>
        <VList
          renderFn={(d) => Card(d, cb, toReport)}
          data={data}
          itemSize={248}
          onLoad={onLoad}
          loadingText={loadingText}
        />
      </div>
    </div>
  );
}

function Card(data, cb, choose) {
  const onCard = () => {
    cb?.(data);
  };

  const chooseFn = async () => {
    choose?.(data);
  };

  const item = findItem(reportEnum, data.progressStatusByte);

  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.cardhead}>
          <div className={styles.name}>
            {data.userName}
            &nbsp;
            <img
              className={styles.gender}
              src={data.gender === 1 ? male : female}
              alt=""
            />
          </div>
          <div
            className={styles.status}
            style={{ color: item?.color, background: item?.bgColor }}
          >
            {data.progressStatus}
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <div className={styles.kv}>
            <div className={styles.k}>编号</div>
            <div className={styles.v}>{data.id}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>手机号码</div>
            <div className={styles.v}>{data.phone}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>出生年月</div>
            <div className={styles.v}>{data.id}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>检查日期</div>
            <div className={styles.v}>{data.created}</div>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.btnBox}>
          <div className="rbtn" style={{ marginRight: 10 }} onClick={onCard}>
            填写报告
          </div>
          <div className="rbtn-fill" onClick={chooseFn}>
            查看报告
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItem(v) {
  return (
    <div className={styles.listBox}>
      <div className={styles.listTitle}>
        {v.doctorName}回复了{v.trainingTime}的{v.planName}
      </div>
      <div className={styles.listDesc}>{v.created}</div>
    </div>
  );
}
