// @ts-nocheck
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import React, { useEffect, useRef } from "react";

const mockData = [
  { date: new Date(2024, 0, 1).getTime(), value: 10 },
  { date: new Date(2024, 0, 2).getTime(), value: 12 },
  { date: new Date(2024, 0, 3).getTime(), value: 9 },
  { date: new Date(2024, 0, 4).getTime(), value: 14 },
];

// export default React.memo(function SparklineChart({
export default function SparklineChart({
  data = mockData,
  // id = "sparkline",
}) {
  // export default function SparklineChart(params) {
  // console.log({ params });
  const timeoutRef = useRef(null);
  const randomId = `sparkline-${Math.random().toString(36).substr(2, 9)}`;

  // const [loaded, setIsLoaded] = React.useState(false);
  useEffect(() => {
    const root = am5.Root.new(randomId);
    // setTimeout(() => {
    timeoutRef.current = window.requestIdleCallback(
      () => {
        // root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            layout: root.verticalLayout,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
          })
        );

        // Remove axes and grid
        const xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "day", count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {
              visible: false,
              strokeOpacity: 0,
              minGridDistance: 999,
            }),
          })
        );

        const yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {
              visible: false,
              strokeOpacity: 0,
              minGridDistance: 999,
            }),
          })
        );

        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            xAxis,
            yAxis,
            valueYField: "value",
            valueXField: "date",
            strokeWidth: 2,
          })
        );

        series.data.setAll(data);
      },
      {
        timeout: 500,
      }
    );

    // setTimeout(() => {
    //   setIsLoaded(true);
    // }, 1);

    return () => {
      if (timeoutRef.current) {
        window.cancelIdleCallback(timeoutRef.current);
        timeoutRef.current = null;
      }
      root.dispose();
    };
  }, [data]);

  // if (!loaded) {
  //   return "hello";
  // }

  return <div id={randomId} style={{ width: "100%", height: "40px" }} />;
  // });
}
