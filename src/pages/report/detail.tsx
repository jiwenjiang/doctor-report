import Video from "@/comps/Video";
import { reportBtnAuth } from "@/hooks/reportBtn";
import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import { PlayCircleO } from "@react-vant/icons";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
    Button,
    DatetimePicker,
    Form,
    Input,
    NavBar,
    Notify,
    Picker,
    Popup,
    Radio,
    Tag,
} from "react-vant";
import "./detail.less";

const ops = [
  { content: "未出现", sn: 1 },
  { content: "疑似", sn: 2 },
  { content: "出现", sn: 3 },
];

function App() {
  const id = GetQueryString("id");
  const editable = GetQueryString("editable");
  const [data, setData] = useState<any>({});
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [show1, setShow1] = useState<any>(false);
  const [show2, setShow2] = useState<any>(false);
  const auth = reportBtnAuth();
  const [questions, setQuestions] = useState([]);
  const [oriQes, setOriQes] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const stage = Form.useWatch("stage", form1);

  const onFinish1 = async (v) => {
    const params = { id, result: v, draft: true };
    await request({
      url: "/scale/record/updateRemark",
      method: "POST",
      data: params,
    });
    setShow1(false);
    getDetail();
    Notify.show({ type: "success", message: "保存成功" });
  };

  const onFinish2 = async (v) => {
    const params = {
      id,
      positionAndSportAbnormal: questions.map((c) => ({
        questionSn: c.sn || c.questionSn,
        optionSn: c.optionSn,
      })),
      draft: true,
    };
    const res = await request({
      url: "/scale/record/updateRemark",
      method: "POST",
      data: params,
    });
    setShow2(false);
    getDetail();
    Notify.show({ type: "success", message: "保存成功" });
    console.log("🚀 ~ onFinish1 ~ v:", res, v);
  };

  const onFinish3 = async () => {
    const result = form2.getFieldsValue();
    const params = {
      id,
      ...result,
      draft: true,
    };
    await request({
      url: "/scale/record/updateRemark",
      method: "POST",
      data: params,
    });
    getDetail();
    Notify.show({ type: "success", message: "保存成功" });
    console.log("🚀 ~ onFinish3 ~ result:", params);
  };

  const getDetail = async () => {
    const res = await request({
      url: "/scale/record/get",
      method: "GET",
      data: {
        id,
        type: 1,
      },
    });
    setData(res.data);
    if (res.data.result?.cerebralPalsyResult?.positionAndSportAbnormal) {
      setOriQes(res.data.result?.cerebralPalsyResult?.positionAndSportAbnormal);
      setQuestions(
        res.data.result?.cerebralPalsyResult?.positionAndSportAbnormal?.map(
          (c) => ({ ...c, options: ops })
        )
      );
    }
    console.log("🚀 ~ getDetail ~ res:", res);
  };

  useEffect(() => {
    getDetail();
  }, []);

  const open = () => {
    setShow1(true);
    form1.setFieldsValue({
      ...data.result.gmsResult,
      nextReserve: new Date(data.result.gmsResult.nextReserve),
    });
  };
  const open2 = async () => {
    if (questions.length === 0) {
      const res = await request({
        url: "/scale/scaleTable/question",
        data: { code: 9 },
      });
      setQuestions(
        res.data?.map((v, i) => ({ ...v, questionSn: i + 1, optionSn: 1 }))
      );
      setOriQes(
        res.data?.map((v, i) => ({ ...v, questionSn: i + 1, optionSn: 1 }))
      );
    }
    setShow2(true);
  };

  const changeStage = () => {
    form1.resetFields(["stageResult"]);
  };

  const changeQuestion = (e, i) => {
    questions[i].optionSn = e;
    setQuestions([...questions]);
  };

  const close = () => {
    setQuestions(
      questions.map((v, i) => ({
        ...v,
        optionSn: oriQes[i].optionSn,
      }))
    );
    setShow2(false);
  };

  const playVideo = (v) => {
    setShowVideo(true);
    setCurrentVideo(v.url);
  };

  const shenhe = () => {};

  const back = () => {
    window.history.back();
  };

  return (
    <div>
      <NavBar title="报告详情" onClickLeft={() => back()} />
      <div className="index" style={{ padding: 12, paddingBottom: 60 }}>
        <div className="card">
          <div className="title">
            <span>基本信息</span>
            <div className="linear-gradient"></div>
          </div>
          <div className="row">
            <span className="label">真实姓名</span>
            <span className="value">{data.name}</span>
          </div>
          <div className="row">
            <span className="label">编号</span>
            <span className="value">{data.id}</span>
          </div>
          <div className="row">
            <span className="label">性别</span>
            <span className="value">{data.gender}</span>
          </div>
          <div className="row">
            <span className="label">出生年月</span>
            <span className="value">{data.birthday}</span>
          </div>
          <div className="row">
            <span className="label">年龄</span>
            <span className="value">{data.age}</span>
          </div>
          <div className="row">
            <span className="label">孕周</span>
            <span className="value">{data.gestationalWeek}</span>
          </div>
          <div className="row">
            <span className="label">纠正年龄</span>
            <span className="value">{data.correctAge}</span>
          </div>
          <div className="row">
            <span className="label">手机号</span>
            <span className="value">{data.testTime}</span>
          </div>
          <div className="row">
            <span className="label">门诊号码</span>
            <span className="value">{data.medicalNumber}</span>
          </div>
          <div className="row">
            <span className="label">母亲高危因素</span>
            <span className="value">
              {data?.motherRisks?.filter((c) => c)?.join(";")}
            </span>
          </div>
          <div className="row">
            <span className="label">儿童高危因素</span>
            <span className="value">
              {data?.childRisks?.filter((c) => c)?.join(";")}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="title">
            <span>视频信息</span>
            <div className="linear-gradient"></div>
          </div>
          <div>
            {data?.answers?.map((v, i) => (
              <div key={i} className="ans-box">
                <div className="ans-title">
                  {i + 1}.{v.name}
                </div>
                {v?.attachments?.map((c, i2) => (
                  <div key={i2} className="ans-box">
                    {c.type === 2 && (
                      <div
                        style={{ position: "relative" }}
                        onClick={() => playVideo(c)}
                      >
                        <img className="ans-img" src={c.coverUrl}></img>
                        <PlayCircleO className="center" />
                      </div>
                    )}
                    {c.type === 1 && <img src={c.url}></img>}
                  </div>
                ))}
                <div className="ans-mark">补充说明：{v.remark}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="title">
            <span>评估结果</span>
            <div className="linear-gradient"></div>
          </div>
          <div>
            <div className="row">
              <span className="label">GMs评测结果</span>
              <span className="value">
                {data?.result?.gmsResult?.stageResult}&emsp;
              </span>
              {auth.includes("SAVE_EDIT_REPORT") &&
                [1, 14].includes(data.progressStatusCode) &&
                editable && (
                  <Tag round type="primary" size="medium" onClick={open}>
                    评估
                  </Tag>
                )}
            </div>
            <div className="row">
              <span className="label">下次GMs评估日期</span>
              <span className="value">
                {data?.result?.gmsResult?.nextReserve
                  ? dayjs(data?.result?.gmsResult?.nextReserve).format(
                      "YYYY-MM-DD"
                    )
                  : null}
              </span>
            </div>
            <div className="row">
              <span className="label">家庭自测结果-儿童脑瘫危险程度</span>
              <span className="value">
                {data?.result?.cerebralPalsyResult?.cerebralPalsyScore ?? 0}
                %&emsp;
              </span>
              {auth.includes("SAVE_EDIT_REPORT") &&
                [1, 14].includes(data.progressStatusCode) &&
                editable && (
                  <Tag round type="primary" size="medium" onClick={open2}>
                    评估
                  </Tag>
                )}
            </div>
            <div className="row">
              <span className="label">是否有高危因素</span>
              <span className="value">
                {data?.result?.cerebralPalsyResult?.haveHighRisk ? "有" : "无"}
              </span>
            </div>
            <div className="row">
              <span className="label">自测结果存在异常</span>
              <span className="value">
                {data?.result?.cerebralPalsyResult?.haveAbnormalIterm
                  ? "有"
                  : "无"}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="title">
            <span>早期干预建议</span>
            <div className="linear-gradient"></div>
          </div>
          <div className="device-box">
            <Form colon layout="vertical" form={form2} footer={null}>
              <Form.Item
                name="obviouslyBehind"
                label="1.视频中表现出来有姿势运动"
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input disabled={!editable} placeholder="非必填，不填则无" />{" "}
                  <span className="tip">明显落后</span>
                </div>
              </Form.Item>
              <Form.Item
                name="tendencyBehind"
                label="2.视频中表现出来有姿势运动"
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input disabled={!editable} placeholder="非必填，不填则无" />{" "}
                  <span className="tip">落后倾向</span>
                </div>
              </Form.Item>
              <Form.Item name="suggests" label="3.其他" className="other">
                <Input disabled={!editable} placeholder="非必填，不填则无" />
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="bottom-box">
          <Button
            round
            type="default"
            style={{ width: "100px" }}
            onClick={back}
          >
            返回
          </Button>
          <Button
            round
            type="primary"
            style={{ width: "100px" }}
            onClick={onFinish3}
          >
            保存
          </Button>
          {/* <Button
            round
            type="primary"
            style={{ width: "100px" }}
            onClick={shenhe}
          >
            提交审核
          </Button> */}
        </div>
        <Popup
          visible={showVideo}
          destroyOnClose
          onClose={() => setShowVideo(false)}
        >
          <Video
            sources={[
              {
                src: currentVideo,
              },
            ]}
          ></Video>
        </Popup>
        <Popup
          visible={show1}
          position="bottom"
          style={{ height: "50%" }}
          destroyOnClose={true}
          onClose={() => setShow1(false)}
          title="评估报告"
        >
          <Form
            colon
            layout="vertical"
            form={form1}
            onFinish={onFinish1}
            footer={
              <div style={{ margin: "16px 16px 0" }}>
                <Button round nativeType="submit" type="primary" block>
                  保存
                </Button>
              </div>
            }
          >
            <Form.Item
              name="stage"
              label="阶段"
              rules={[{ required: true, message: "请选择" }]}
            >
              <Radio.Group direction="horizontal" onChange={changeStage}>
                <Radio name={"1"} value={"1"}>
                  扭动阶段
                </Radio>
                <Radio name={"2"} value={"2"}>
                  不安运动阶段
                </Radio>
                <Radio name={"3"} value={"3"}>
                  无法评估
                </Radio>
              </Radio.Group>
            </Form.Item>
            {stage === "1" && (
              <Form.Item
                isLink
                name="stageResult"
                label="扭动阶段"
                trigger="onConfirm"
                rules={[{ required: true, message: "请选择" }]}
                onClick={(_, action) => {
                  action.current?.open();
                }}
              >
                <Picker
                  popup
                  columns={[
                    { text: "正常（N）", value: "正常（N）" },
                    { text: "单调性GMs(PR)", value: "单调性GMs(PR)" },
                    {
                      text: "痉挛-同步性GMs (CS)",
                      value: "痉挛-同步性GMs (CS)",
                    },
                    { text: "混乱性GMs (CH)", value: "混乱性GMs (CH)" },
                  ]}
                >
                  {(val) => val || "请选择"}
                </Picker>
              </Form.Item>
            )}
            {stage === "2" && (
              <Form.Item
                isLink
                name="stageResult"
                label="不安运动阶段"
                trigger="onConfirm"
                rules={[{ required: true, message: "请选择" }]}
                onClick={(_, action) => {
                  action.current?.open();
                }}
              >
                <Picker
                  popup
                  columns={[
                    { text: "正常 (F+)", value: "正常 (F+)" },
                    { text: "异常性不安运动(AF)", value: "异常性不安运动(AF)" },
                    { text: "不安运动缺乏（F-）", value: "不安运动缺乏（F-）" },
                  ]}
                >
                  {(val) => val || "请选择"}
                </Picker>
              </Form.Item>
            )}
            {stage === "3" && (
              <Form.Item
                isLink
                name="stageResult"
                label="无法评估"
                trigger="onConfirm"
                rules={[{ required: true, message: "请选择" }]}
                onClick={(_, action) => {
                  action.current?.open();
                }}
              >
                <Picker
                  popup
                  columns={[
                    { text: "儿童超龄", value: "儿童超龄" },
                    { text: "视频拍摄不合格", value: "视频拍摄不合格" },
                  ]}
                >
                  {(val) => val || "请选择"}
                </Picker>
              </Form.Item>
            )}
            <Form.Item
              isLink
              name="nextReserve"
              label="下次GMs评估日期"
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
        </Popup>
        <Popup
          visible={show2}
          position="bottom"
          style={{ height: "80%" }}
          destroyOnClose={true}
          onClose={() => setShow2(false)}
          title="评估报告"
        >
          <div className="pop-box">
            {questions?.map((c, i) => (
              <div key={i} className="pop-item">
                <div className="label">
                  {i + 1}.{c.content || c.name}
                </div>
                <div>
                  <Radio.Group
                    direction="horizontal"
                    onChange={(e) => changeQuestion(e, i)}
                    value={c.optionSn}
                  >
                    {c.options?.map((s) => (
                      <Radio key={s.sn} name={s.sn} value={s.sn}>
                        {s.content}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            ))}
          </div>
          <div className="bottom-box">
            <Button
              round
              type="default"
              style={{ width: "100px" }}
              onClick={close}
            >
              取消
            </Button>
            <Button
              round
              type="primary"
              style={{ width: "100px" }}
              onClick={onFinish2}
            >
              保存
            </Button>
          </div>
        </Popup>
      </div>
    </div>
  );
}

export default App;
