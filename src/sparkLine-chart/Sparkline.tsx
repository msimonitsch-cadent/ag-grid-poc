import React, { useLayoutEffect, useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const sparklineData = [
  { category: "1", value: 10 },
  { category: "2", value: 20 },
  { category: "3", value: 15 },
  { category: "4", value: 25 },
  { category: "5", value: 22 },
  { category: "6", value: 30 },
];

export const SparklineChart = React.memo(({ data = sparklineData, id }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    console.log("running");
    // Apply theme
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create(id, am4charts.XYChart);
    chart.padding(0, 0, 0, 0);

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    // series.strokeWidth(2);
    series.stroke = am4core.color("#49BFE3");
    series.tensionX = 0.8;
    series.tooltip.disabled = true;

    // Add data
    chart.data = data;

    // Disable chart cursor
    chart.cursor = null;

    // Store chart reference
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div id={id} style={{ width: "100%", height: "100%" }}></div>;
});
