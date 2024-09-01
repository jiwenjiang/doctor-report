import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import * as echarts from "echarts";
import React, { useEffect, useRef, useState } from "react";
import wx from "weixin-js-sdk";
import "./duoyuan-trend.less";

function App() {
  const id = useRef(GetQueryString("id") ?? 12);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    sessionStorage.token =
      GetQueryString("token") ??
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlTmFtZSI6Im80V2dMNUxTakdJdGRYUnc1S3IzcUh6U1VIZkUiLCJ1c2VySWQiOiIxIiwicGxhdGZvcm1Db2RlIjoyfQ.LMeqYmcS73AdOYHCgdwFT-oRJbRnXi4aobqR1uY7jccBPWeTyeDk4ufiKqt7UUU4-PF33zA34DLC4V9wju8LPg";
    getType();
    document.title = "多元智能报告";
  }, []);

  const getType = async () => {
    const res = await request({
      url: "/mi/report",
      data: {
        id: id.current,
      },
    });
    setData(res.data);
    redarChart(res.data?.report);
    BarChart(res.data?.report);
  };

  const redarChart = (list) => {
    var chartDom = document.getElementById("chart1");
    var myChart = echarts.init(chartDom);

    const series = [
      {
        value: new Array(list.length).fill(2.5),
        name: "平均分",
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
            {
              color: "rgba(17, 189, 140,0.1)",
              offset: 0,
            },
            {
              color: "rgba(17, 189, 140,0.9)",
              offset: 1,
            },
          ]),
        },
      },
      {
        value: list.map((c) => c.score),
        name: "智能能力得分",
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
            {
              color: "rgba(255, 228, 52,0.1)",
              offset: 0,
            },
            {
              color: "rgba(255, 228, 52,0.9)",
              offset: 1,
            },
          ]),
        },
        label: {
          show: true,
          formatter: function (params) {
            return params.value;
          },
        },
      },
    ];

    const option = {
      color: ["#67F9D8", "#FFE434", "#56A3F1", "#FF917C"],
      title: {
        text: "",
      },
      grid: {
        left: "23%",
        right: "23%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      legend: {},
      radar: [
        {
          indicator: list.map((c) => ({ text: c.name, max: 5 })),
          center: ["50%", "50%"],
          radius: 90,
        },
      ],
      series: [
        {
          type: "radar",
          data: series,
        },
      ],
    };
    option && myChart.setOption(option);
  };

  const BarChart = (list) => {
    var chartDom = document.getElementById("chart2");
    var myChart = echarts.init(chartDom);

    const sortList = list.sort((a, b) => b.score - a.score);
    const l1 = list.filter((c) => c.score > 2.5);
    const l2 = list.filter((c) => c.score === 2.5);
    const l3 = list.filter((c) => c.score < 2.5);
    console.log("🚀 ~ BarChart ~ sortList:", sortList);

    const series = [
      {
        name: "优势智能3",
        type: "bar",
        data: [
          ...l1.map((c, i) => ({
            name: c.name,
            value: c.score,
            itemStyle: {
              color: "#56A3F1",
            },
          })),
          ...l2.map((c, i) => ({
            name: c.name,
            value: c.score,
            itemStyle: {
              color: "#67F9D8",
            },
          })),
          ...l3.map((c, i) => ({
            name: c.name,
            value: c.score,
            itemStyle: {
              color: "#FFE434",
            },
          })),
        ],
        label: {
          normal: {
            show: true,
            position: "top", // 标签的位置在柱子的顶部
            formatter: function (params) {
              // 如果数据值不为0，则显示标签
              if (params.value !== 0) {
                return params.value;
              } else {
                // 数据值为0时，不显示标签
                return "";
              }
            },
            fontSize: 12,
            fontWeight: "bold",
          },
        },
      },
      //   {
      //     name: "一般智能",
      //     type: "bar",
      //     data: [
      //       ...new Array(l1.length).fill(null),
      //       ...l2.map((c, i) => ({ name: c.name, value: c.score })),
      //       ...new Array(l3.length).fill(null),
      //     ],
      //     label: {
      //       normal: {
      //         show: true,
      //         position: "top", // 标签的位置在柱子的顶部
      //         formatter: function (params) {
      //           // 如果数据值不为0，则显示标签
      //           if (params.value !== 0) {
      //             return params.value;
      //           } else {
      //             // 数据值为0时，不显示标签
      //             return "";
      //           }
      //         },
      //         fontSize: 12,
      //         fontWeight: "bold",
      //       },
      //     },
      //   },
      //   {
      //     name: "弱势智能",
      //     type: "bar",
      //     data: [
      //       ...new Array(sortList.length - l3.length).fill(null),
      //       ...l3.map((c, i) => ({ name: c.name, value: c.score })),
      //     ],
      //     label: {
      //       normal: {
      //         show: true,
      //         position: "top", // 标签的位置在柱子的顶部
      //         formatter: function (params) {
      //           // 如果数据值不为0，则显示标签
      //           if (params.value !== 0) {
      //             return params.value;
      //           } else {
      //             // 数据值为0时，不显示标签
      //             return "";
      //           }
      //         },
      //         fontSize: 12,
      //         fontWeight: "bold",
      //       },
      //     },
      //   },
    ];
    const option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          // params 是一个数组，包含了每个系列的数据信息
          // 这里我们只取第一个系列的数据
          var seriesName = params[0].name; // 系列名称
          var value = params[0].value; // 数据值

          // 自定义显示的文本，这里只显示系列名称和数据值
          return seriesName + " : " + value;
        },
      },
      legend: {
        show: false,
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sortList.map((c) => c.name),
        axisTick: {
          show: false,
        },
        axisLabel: {
          rotate: 45, // 旋转标签的角度，正值为逆时针旋转
          fontSize: 12, // 适当减小字体大小
        },
      },
      yAxis: {
        type: "value",
      },
      series: series,
    };
    option && myChart.setOption(option);
  };

  const back = () => {
    wx.miniProgram.navigateTo({
      url: `/evaluatePackage/pages/duoyuan`,
    });
  };

  return (
    <div className="index" style={{ padding: 12, paddingBottom: 60 }}>
      <div className="card">
        <div className="title">
          <span>基本信息</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="row">
          <span className="label">姓名</span>
          <span className="value">{data.name}</span>
        </div>
        <div className="row">
          <span className="label">年龄</span>
          <span className="value">{data.age}</span>
        </div>
        <div className="row">
          <span className="label">性别</span>
          <span className="value">{data.gender}</span>
        </div>
        <div className="row">
          <span className="label">测试时间</span>
          <span className="value">{data.testTime}</span>
        </div>
      </div>
      <div className="card">
        <div className="title">
          <span>智能能力分布</span>
          <div className="linear-gradient"></div>
        </div>
        <div id="chart1" style={{ width: "85vw", height: 360 }}></div>
      </div>
      <div className="card">
        <div className="title">
          <span>智能能力强弱</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="legend-box">
          <div className="legend">
            <span
              className="rect"
              style={{ backgroundColor: "#56A3F1" }}
            ></span>
            <span className="text">优势智能</span>
          </div>
          <div className="legend">
            <span
              className="rect"
              style={{ backgroundColor: "#67F9D8" }}
            ></span>
            <span className="text">一般智能</span>
          </div>
          <div className="legend">
            <span
              className="rect"
              style={{ backgroundColor: "#FFE434" }}
            ></span>
            <span className="text">弱势智能</span>
          </div>
        </div>
        <div id="chart2" style={{ width: "85vw", height: 360 }}></div>
        <div className="title">
          <span>注意</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="desc">
          智能没有好坏之分。它所能代表的只是个人在八大智能上的优劣程度，而不是八大智能的智商上的排序。这种优势旨让我们的教育更有针对性和效益性，对于小宝宝，真正实现全面发展的目标。对于青少年和成人，能真正聚焦自己的优势智能，人生不再纠结。
        </div>
      </div>
      <div className="card">
        <div className="title">
          <span>温馨提示</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="desc">
          ①0-7岁，为孩子智能全面发展的重要阶段，请在养育过程中，给孩子更多的发展机会。
        </div>
        <div className="desc">
          ②7-12岁，为孩子智能发展的机会期，在教育过程中，关注孩子优势智能的同时，兼顾劣势智能的补充。
        </div>
        <div className="desc">
          ③12岁以后，父母应把注意力更多放在优势智能的发展上，而不是盯着劣势智能。
        </div>
      </div>
      <div className="bottom-box">
        <div className="primary-btn" onClick={back}>
          返回
        </div>
      </div>
    </div>
  );
}

export default App;
