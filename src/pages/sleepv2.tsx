import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import * as echarts from "echarts";
import React, { useEffect, useRef, useState } from "react";
import wx from "weixin-js-sdk";
import "./sleepv2.less";

function App() {
  const id = useRef(GetQueryString("id") ?? 12);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    sessionStorage.token =
      GetQueryString("token") ??
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlTmFtZSI6Im80V2dMNUxTakdJdGRYUnc1S3IzcUh6U1VIZkUiLCJ1c2VySWQiOiIxIiwicGxhdGZvcm1Db2RlIjoyfQ.LMeqYmcS73AdOYHCgdwFT-oRJbRnXi4aobqR1uY7jccBPWeTyeDk4ufiKqt7UUU4-PF33zA34DLC4V9wju8LPg";
    getType();
    document.title = "3-12岁睡眠报告";
  }, []);

  const getType = async () => {
    const res = await request({
      url: "/sleep/assessment/report",
      data: {
        id: id.current,
      },
    });
    setData(res.data);
    BarChart(res.data);
  };

  const BarChart = (list) => {
    var chartDom = document.getElementById("chart2");
    var myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
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
        data: list.sleepBehavior.map((c) => c.subcategory),
        axisLabel: {
          rotate: 45, // 旋转标签的角度，正值为逆时针旋转
          fontSize: 12, // 适当减小字体大小
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "睡眠",
          type: "bar",
          data: list.sleepBehavior.map((c) => c.score),
          itemStyle: {
            normal: {
              color: "#11bd8c",
            },
          },
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
      ],
    };
    option && myChart.setOption(option);
  };

  const back = () => {
    wx.miniProgram.navigateTo({
      url: `/minePackage/pages/sleepv2`,
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
          <span>评估结果</span>
          <div className="linear-gradient"></div>
        </div>
        <div
          className="result-box"
          style={{ color: data.score <= 54 ? "#11bd8c" : "#bd1153" }}
        >
          {data.result}
        </div>
      </div>
      <div className="card">
        <div className="title">
          <span>睡眠时间</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="table-p-box">
          <div className="table-box">
            <div className="row">
              <span className="item1"></span>
              <span className="item">平时</span>
              <span className="item">周末</span>
              <span className="item">平均</span>
            </div>
            <div className="row">
              <span className="item1">睡眠时间（H）</span>
              <span className="item">{data?.sleepTime?.[0]?.[0]}</span>
              <span className="item">{data?.sleepTime?.[0]?.[1]}</span>
              <span className="item">{data?.sleepTime?.[0]?.[2]}</span>
            </div>
            <div className="row">
              <span className="item1">入睡潜伏期（MIN）</span>
              <span className="item">{data?.sleepTime?.[1]?.[0]}</span>
              <span className="item">{data?.sleepTime?.[1]?.[1]}</span>
              <span className="item">{data?.sleepTime?.[1]?.[2]}</span>
            </div>
          </div>
          <div className="table-title">推荐睡眠时间</div>
          <div className="desc">（1）3-5岁(幼儿园）【10h-13h】；</div>
          <div className="desc">（2） 6-12岁（小学）【9h-11h】；</div>
          <div className="desc">（3）13-16岁（初高中）【8-10h】；</div>
          <div className="desc">
            （4）周末-平时变动时间＜1小时，入睡潜伏期≤20分钟。
          </div>
        </div>
      </div>
      <div className="card">
        <div className="title">
          <span>睡眠行为</span>
          <div className="linear-gradient"></div>
        </div>

        <div id="chart2" style={{ width: "85vw", height: 360 }}></div>
        <div className="title">
          <span>备注</span>
          <div className="linear-gradient"></div>
        </div>
        <div className="desc">
          （1）就寝习惯：儿童入睡前的习惯，上床时间不固定及需要陪睡等行为；
        </div>
        <div className="desc">（2）入睡潜伏期：儿童上床到睡着的时间；</div>
        <div className="desc">
          （3）睡眠持续时间:睡眠持续时间少，睡眠作息不规律；
        </div>
        <div className="desc">（4）睡眠焦虑：儿童入睡需要陪睡，怕黑等；</div>
        <div className="desc">（5）夜醒：夜间清醒次数多；</div>
        <div className="desc">
          （6）异态睡眠：儿童睡眠中存在尿床、梦游、磨牙等现象
        </div>
        <div className="desc">
          （7）睡眠呼吸障碍：儿童睡眠中存在打鼾、呼吸暂停、憋气等呼吸困难现象；
        </div>
        <div className="desc">
          （8） 白天嗜睡：儿童早晨很难唤醒，白天容易嗜睡。
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
