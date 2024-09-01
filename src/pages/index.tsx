import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import * as echarts from "echarts";
import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "react-vant";
import "./index.less";

function App() {
  const classify = useRef(GetQueryString("classify") ?? 1);
  const [list, setList] = useState([]);
  const childrenId = useRef(GetQueryString("childId") ?? 3);
  const legendData = useRef();
  const xData = useRef();
  const seriesData = useRef();
  const activeTab = useRef(0);
  const types = [
    { label: "身高", value: 1 },
    { label: "体重", value: 2 },
    { label: "头围", value: 3 },
    { label: "身高别体重", value: 4 },
    { label: "BMI", value: 5 },
    // { label: "", value: 5 },
  ];
  const chartData = useRef<any>({});

  useEffect(() => {
    sessionStorage.token =
      GetQueryString("token") ??
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlTmFtZSI6Im9wX0kxNUFtVjRxeXAyTF9udmFtbzYxQi1uZDAiLCJ1c2VySWQiOiI0MDUiLCJwbGF0Zm9ybUNvZGUiOjJ9.G4iLwIXnKHVIFtOq-m_yxwXQdmw60YaDc5fFBqdE56yDUdYYVIAT0lbK5TU3A3gvdTJ8I90hCTRJb_IDya0Wog";
    getType();
  }, []);

  const getType = async () => {
    const res = await request({
      url: "/growth/curve/type",
      data: {
        classify: classify.current,
      },
    });
    setList(res.data);
    setTimeout(() => {
      getChart(res.data[0]?.code);
    });
  };

  const getChart = async (v) => {
    console.log("🚀 ~ file: index.tsx:36 ~ getChart ~ v:", v);
    const res = await request({
      url: "/growth/curve",
      data: {
        childrenId: childrenId.current,
        curveCode: v,
      },
    });
    const { data } = res;
    legendData.current = data.baseData?.map((v) => v.key).concat(data.title);

    xData.current = data.baseData?.[0]?.value?.map((v) => v[0]);

    seriesData.current = data.baseData
      ?.map((v) => ({
        name: v.key,
        type: "line",
        data: v.value.map((c) => c[1]),
      }))
      .concat({ name: data.title, type: "line", data: data.curveDate });
    chartData.current = data;
    setChart();
  };

  const back = () => {};

  const setChart = () => {
    var chartDom = document.getElementById("chart");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: chartData.current.title,
        show: false,
      },
      tooltip: {
        trigger: "axis",
      },
      dataZoom: {
        type: "inside",
      },
      legend: {
        data: legendData.current,
      },
      grid: {
        left: "3%",
        right: "10%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: false,
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: xData.current,
        name: chartData.current.xunit,
        nameTextStyle: {
          color: "#ffd340", //颜色
          padding: [30, 0, 0, -10], //间距分别是 上 右 下 左
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      yAxis: {
        type: "value",
        min: chartData.current.ymin,
        max: chartData.current.ymax,
        name: chartData.current.yunit,
        nameLocation: "end",
        nameTextStyle: {
          color: "#ffd340", //颜色
          padding: [0, 0, 0, -45], //间距分别是 上 右 下 左
          fontSize: 16,
          fontWeight: "bold",
        },
        axisLine: {
          show: true,
        },
        // y轴上的小横线
        axisTick: {
          show: true,
        },
      },
      series: seriesData.current,
    };

    option && myChart.setOption(option);
  };

  const changeTab = (v) => {
    activeTab.current = v;
    getChart(list[v].code);
    console.log("🚀 ~ file: index.tsx:95 ~ changeTab ~ v:", v);
  };

  const changeCode = (v) => {
    classify.current = v.index + 1;
    getType();
    console.log("🚀 ~ file: index.tsx:135 ~ changeCode ~ v:", v);
  };

  return (
    <div className="App">
      {/* <NavBar
        title="生长曲线"
        leftText="返回"
        rightText="按钮"
        onClickLeft={() => back()}
        onClickRight={() => back()}
      /> */}
      <Tabs onChange={changeTab} className="tabs">
        {list.map((item, i) => (
          <Tabs.TabPane key={i} title={item.title}></Tabs.TabPane>
        ))}
      </Tabs>
      <div id="chart" style={{ width: "100vw", height: 500 }}></div>
      <Tabs
        type="card"
        onClickTab={changeCode}
        defaultActive={Number(classify.current) - 1}
      >
        {types.map((item, i) => (
          <Tabs.TabPane
            disabled={i === 5}
            key={i}
            title={`${item.label}`}
          ></Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default App;
