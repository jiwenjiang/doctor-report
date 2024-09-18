import MineCenter from "@/comps/Mine";
import VList from "@/comps/VList";
import { orderEnum } from "@/service/const";
import request from "@/service/request";
import { findItem } from "@/service/utils";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DatetimePicker,
  Form,
  NavBar,
  Picker,
  Popup,
  Tag,
} from "react-vant";
import styles from "./list.module.less";

export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const total = useRef(1);
  const [count, setCount] = useState(0);
  const params = useRef({ pageNo: 1, pageSize: 10, patientId: null });
  const [condition, setCondition] = useState<any>({
    status: "",
    startTime: "",
    endTime: "",
  });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState("正在加载中");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    }
  };

  const getList = async (init?: boolean, extendParams = {}) => {
    const res = await request({
      url: "/scaleOrder/list",
      data: { ...params.current, ...condition, ...extendParams },
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText("无更多数据了~");
    }
    setData(init ? res.data?.list : [...data, ...res.data?.list]);
    setCount(res.data?.page?.totalRecord);
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

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    params.current.pageNo = 1;
    console.log("🚀 ~ onFinish ~ values:", values);
    setCondition({
      status: values.status,
      startTime: values.startTime ? dayjs(values.startTime).valueOf() : "",
      endTime: values.endTime ? dayjs(values.endTime).valueOf() : "",
    });
    onClose();
  };

  const cancel = () => {
    form.resetFields();
    setCondition({
      status: "",
      startTime: "",
      endTime: "",
    });
    onClose();
  };

  const search = () => {
    params.current.pageNo = 1;
    getList(true);
  };

  return (
    <div className={styles.box}>
      <NavBar
        title="订单列表"
        onClickLeft={() => window.history.back()}
        rightText={<MineCenter reload={search} />}
      />
      <div className={styles.filterBox}>
        <div>
          订单合计：<span style={{ color: "#00BF83" }}>{count}</span>
        </div>
        <div>
          <Tag
            size="large"
            type="primary"
            plain
            onClick={() => setVisible(true)}
          >
            筛选
          </Tag>
        </div>
      </div>

      <div>
        <VList
          renderFn={(d) => Card(d)}
          data={data}
          itemSize={268}
          onLoad={onLoad}
          loadingText={loadingText}
        />
      </div>
      <Popup
        visible={visible}
        style={{ width: "80%", height: "100%" }}
        position="right"
        onClose={onClose}
        title="订单条件筛选"
      >
        <div className={styles.box}>
          <Form
            colon
            layout="vertical"
            form={form}
            onFinish={onFinish}
            footer={
              <div className={styles.drawerBottom}>
                <Button round block onClick={cancel}>
                  重置
                </Button>
                <Button round nativeType="submit" type="primary" block>
                  查询
                </Button>
              </div>
            }
          >
            {
              <Form.Item
                isLink
                name="status"
                label="订单状态"
                trigger="onConfirm"
                onClick={(_, action) => {
                  action.current?.open();
                }}
              >
                <Picker
                  popup
                  columns={[
                    { text: "全部", value: "" },
                    ...Object.values(orderEnum).map((c) => ({
                      text: c.label,
                      value: c.value,
                    })),
                  ]}
                >
                  {(_val, r: any) => r?.text || "请选择"}
                </Picker>
              </Form.Item>
            }

            <Form.Item
              isLink
              name="startTime"
              label="开始时间"
              trigger="onConfirm"
              onClick={(_, action) => {
                action.current?.open();
              }}
            >
              <DatetimePicker popup type="date">
                {(val: Date) =>
                  val ? dayjs(val).format("YYYY-MM-DD") : "请选择日期"
                }
              </DatetimePicker>
            </Form.Item>
            <Form.Item
              isLink
              name="endTime"
              label="结束时间"
              trigger="onConfirm"
              onClick={(_, action) => {
                action.current?.open();
              }}
            >
              <DatetimePicker popup type="date">
                {(val: Date) =>
                  val ? dayjs(val).format("YYYY-MM-DD") : "请选择日期"
                }
              </DatetimePicker>
            </Form.Item>
          </Form>
        </div>
      </Popup>
    </div>
  );
}

function Card(data) {
  const item = findItem(orderEnum, data.progressStatusByte);

  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.cardhead}>
          <div className={styles.name}>{data.phone}</div>
          <div
            className={styles.status}
            style={{ color: item?.color, background: item?.bgColor }}
          >
            {data.orderStatus}
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <div className={styles.kv}>
            <div className={styles.k}>用户姓名</div>
            <div className={styles.v}>{data.userName}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>商品名称</div>
            <div className={styles.v}>{data.productName}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>支付金额</div>
            <div className={styles.v}>{data.totalPaid}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>下单时间</div>
            <div className={styles.v}>{data.createTime}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>支付时间</div>
            <div className={styles.v}>{data.payTime}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>已使用/总次数</div>
            <div className={styles.v}>
              {data.usedTimes} / {data.totalTimes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
