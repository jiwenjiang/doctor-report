import request from "@/service/request";
import { GetQueryString } from "@/service/utils";
import * as echarts from "echarts";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import wx from "weixin-js-sdk";
import "./duoyuan-trend.less";


// 1是准备入睡，2是睡眠中，3是清醒

const StackedBarChart = () => {
  const chartRef = useRef(null);
  const legend = useRef([]);
  const xAxis = useRef([]);
  const seriesList = useRef([]);
  const childrenId = useRef(GetQueryString("childId") ?? 26);

  useEffect(() => {
    sessionStorage.token =
      GetQueryString("token") ??
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJyb2xlTmFtZSI6Im80V2dMNUxTakdJdGRYUnc1S3IzcUh6U1VIZkUiLCJ1c2VySWQiOiIxIiwicGxhdGZvcm1Db2RlIjoyfQ.LMeqYmcS73AdOYHCgdwFT-oRJbRnXi4aobqR1uY7jccBPWeTyeDk4ufiKqt7UUU4-PF33zA34DLC4V9wju8LPg";
    getData();
    document.title = "多元智能趋势";
  }, []);

  const getData = async () => {
    const res = await request({
      url: "/mi/trend",
      data: {
        childrenId: childrenId.current,
      },
    });
    buildOps(res.data);
  };

  const buildOps = (data) => {
    legend.current = data.map((c) => c.name);
    xAxis.current = data[0]?.data?.map((c) => c[0]);
    seriesList.current = data?.map((c) => ({
      name: c.name,
      type: "line",
      data: c.data.map((v) => v[1]),
    }));

    seriesList.current[0].markLine = {
      symbol: "none",
      label: {
        normal: {
          show: true,
          // 指定标签的确切位置，可以是像素值或百分比
          // 可以调整偏移量
          offset: [-170, 0],
          formatter: "智能平均线",
        },
      },
      lineStyle: {
        normal: {
          type: "dashed",
        },
      },
      data: [
        {
          yAxis: 2.5, // 纵坐标的值，决定横向辅助线在y轴的位置
        },
      ],
    };
    renderChart();
  };

  const renderChart = () => {
    const chart = echarts.init(chartRef.current);

    var option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: legend.current,
      },
      grid: {
        left: "3%",
        right: "10%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xAxis.current,
        axisLabel: {
          formatter: function (value) {
            // 使用正则表达式进行换行，这里假设日期格式为 '月日'
            const arr1 = moment(value).format("MM月DD日");
            const arr2 = value.substring(11, 16);
            return arr1 + "\n" + arr2;
          },
          //   rotate: 45, // 旋转标签一定角度以便换行后的文字能够显示
          margin: 10, // 调整标签与轴线的距离，以便为换行提供空间
          fontSize: 12,
          fontFamily: "sans-serif",
        },
      },
      yAxis: {
        type: "value",
      },
      markLine: {
        symbol: "none", // 线条两端无需标记
        silent: true, // 鼠标悬浮时不显示提示
        data: [
          {
            name: "智能线段",
            yAxis: 2.5, // 线段的Y轴值
            lineStyle: {
              type: "dashed", // 设置为虚线
              color: "red", // 线条颜色
            },
            label: {
              show: true, // 显示标签
            },
          },
        ],
      },
      series: seriesList.current,
    };

    chart.setOption(option);
  };

  const goto = () => {
    wx.miniProgram.navigateTo({
      url: `/evaluatePackage/pages/duoyuan`,
    });
  };

  return (
    <div className="index">
      <div className="modeBox">
        <div className="mode" onClick={goto}>
          测试记录
        </div>
        <div className="mode active">发展趋势</div>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default StackedBarChart;
