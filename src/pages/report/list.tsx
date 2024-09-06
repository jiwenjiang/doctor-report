import VList from "@/comps/VList";
import { reportEnum } from "@/service/const";
import request from "@/service/request";
import { findItem } from "@/service/utils";
import female from "@/static/imgs/female.png";
import male from "@/static/imgs/male.png";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Loading,
  NavBar,
  Overlay,
  Popup,
  Search,
  Tabs,
} from "react-vant";
import Audit from "./comps/audit";
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
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [auditShow, setAuditShow] = useState(false);
  const [pdf, setPdf] = useState({ show: false, src: [] });
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
  const [row, setRow] = useState<any>({});

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

  const cb = async (data, type) => {
    setRow(data);
    if (type === "detail") {
      navigate(`/reportDetail?id=${data.id}`);
    }
    if (type === "edit") {
      navigate(`/reportDetail?id=${data.id}&editable=1`);
    }
    if (type === "audit") {
      setAuditShow(true);
    }
    if (type === "send") {
      try {
        await Dialog.confirm({
          title: "发送用户",
          message: "一旦发送报告将无法修改，确认发送给用户？",
        });
        await request({ url: "/scale/report/send", data: { id: data.id } });
        getList(true);
      } catch (error) {
        console.log("cancel");
      }
    }
  };

  const toReport = async (v) => {
    setShow(true);
    const res = await request({
      url: "/scale/report/picture",
      data: { id: v?.id },
    });

    setPdf({ show: true, src: res.data });
    setShow(false);
    console.log("🚀 ~ toReport ~ res:", res);

    // navigate(`/report/${v.id}`);
  };

  const search = () => {
    setCondition({ ...condition, word: keyword });
  };

  const changeTab = (e) => {
    params.current.pageNo = 1;
    setCondition({ ...condition, status: e });
  };

  const searchChange = (e) => {
    setKeyword(e);
  };

  const confirmAudit = async (params) => {
    const res = await request({
      url: "/scale/report/review",
      method: "POST",
      data: { ...params, id: row.id },
    });
    if (res.success) {
      getList(true);
      setAuditShow(false);
    }
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
      <Popup
        visible={pdf.show}
        destroyOnClose
        position="bottom"
        closeable
        style={{ height: "100%" }}
        onClose={() => setPdf({ show: false, src: [] })}
      >
        <div style={{ paddingTop: 45, width: "100%", height: "auto" }}>
          {pdf?.src?.map((c, i) => (
            <img key={i} src={c} width="100%" height="100%"></img>
          ))}
        </div>
      </Popup>
      <Overlay
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        visible={show}
        onClick={() => setShow(false)}
      >
        <Loading type="ball" vertical>
          报告生成中...
        </Loading>
      </Overlay>
      <Audit
        show={auditShow}
        onClose={() => setAuditShow(false)}
        onConfirm={confirmAudit}
      />
    </div>
  );
}

function Card(data, cb, choose) {
  const onCard = (type) => {
    cb?.(data, type);
  };

  const chooseFn = async () => {
    choose?.(data);
  };

  const item = findItem(reportEnum, data.progressStatusByte);

  return (
    <div className={styles.cardBox} onClick={() => onCard("detail")}>
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
          <div className="rbtn-fill" onClick={chooseFn}>
            查看报告
          </div>
          {[reportEnum.WEIPINGGU.value, reportEnum.BUTONGGUO.value].includes(
            data.progressStatusByte
          ) && (
            <div
              className="rbtn"
              style={{ marginRight: 10 }}
              onClick={() => onCard("edit")}
            >
              填写报告
            </div>
          )}
          {[reportEnum.DAISHENHE.value].includes(data.progressStatusByte) && (
            <div
              className="rbtn"
              style={{ marginRight: 10 }}
              onClick={() => onCard("audit")}
            >
              审核报告
            </div>
          )}
          {[reportEnum.DAIFASONG.value].includes(data.progressStatusByte) && (
            <div
              className="rbtn"
              style={{ marginRight: 10 }}
              onClick={() => onCard("send")}
            >
              发送报告
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
