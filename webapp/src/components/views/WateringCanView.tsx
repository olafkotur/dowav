import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import D3Graph from "../../d3/d3Graph";
import useFetch from "../../hooks/useFetch";

type WaterData = {
  time: number;
  tilt: number;
  volume: number;
};

const WateringCanView: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<WaterData>();
  const container = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<boolean>(false);
  const [d3chart, setD3chart] = useState<D3Graph | null>(null);
  const { loading, data, error } = useFetch({
    query: { endpoint: "/api/historic/water" },
    refetch: 0,
    useCache: false
  });

  useEffect(() => {
    if (data && d3chart && container.current) {
      d3chart.setData(
        data.map((d: any) => {
          return { ...d, value: d.volume, time: d.time * 1000 };
        })
      );
    }
  }, [data, d3chart]);

  useEffect(() => {
    if (d3chart) {
      d3chart.plot("start");
    }
  }, [d3chart]);
  useEffect(() => {
    if (container.current && data && data.length > 0) {
      let el = container.current;
      if (el.childNodes.length === 0) {
        let dim = container.current.getBoundingClientRect();
        d3.select(el)
          .append("svg")
          .attr("id", "water-data")
          .attr("width", dim.width)
          .attr("height", dim.height);
        const svg = document.getElementById("water-data");
        if (svg) {
          const chart = new D3Graph({
            svg,
            viewport: { width: dim.width, height: dim.height },
            data: data.map((d: any) => {
              return { ...d, value: d.volume, time: d.time * 1000 };
            }),
            conf: {
              yDomain: [0, 100],
              title: "Water dispensing volume for last 24 hours",
              id: "water-data",
              name: "water-data",
              timePeriod: { timePeriod: 5, selected: true }
            }
          });
          setD3chart(chart);
        }
        return () => {
          if (d3chart) {
            d3chart.clean();
          }
        };
      }
    }
  }, [container.current, d3chart, data]);

  useEffect(() => {
    const ws = new WebSocket("ws://dowav-api.herokuapp.com/api/water");

    ws.onmessage = function(event) {
      try {
        const json = JSON.parse(event.data);
        setCurrentValue(json);
      } catch (e) {
        console.error(e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="watering-can">
      <svg width="500px" height="400px">
        <g
          style={{
            transform: `rotate(${
              currentValue ? currentValue.tilt : 0
            }deg) translate(0, -100px)`,
            transformOrigin: "50% 50%",
            transition: "transform 1s linear"
          }}
        >
          <SVGelements currentValue={currentValue} />
        </g>
      </svg>
      <div
        style={{ flex: "1", width: "100%", position: "relative" }}
        ref={container}
      ></div>
    </div>
  );
};

const SVGelements: React.FC<{ currentValue: WaterData | undefined }> = ({
  currentValue
}) => {
  return (
    <>
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="354.37"
        y1="283.4964"
        x2="353.5123"
        y2="420.9108"
      >
        <stop offset="0" style={{ stopColor: "#404040" }} />
        <stop offset="0.1156" style={{ stopColor: "#474643" }} />
        <stop offset="0.6608" style={{ stopColor: "#625E50" }} />
        <stop offset="0.9804" style={{ stopColor: "#6C6755" }} />
      </linearGradient>
      <path
        className="st0"
        d="M287.22,373.14c22.78-28.37,45.57-56.74,68.35-85.11c11.31-14.09,22.62-28.17,33.94-42.26
	c4.82-6.01,10.03-11.85,14.34-18.24c3.15-4.67,5.01-8.73,10.93-7.32c11.06,2.63,10-21.07,3.26-26.11c-5.19-3.89-7.49,3.37-9.59,7.12
	c-4.33,7.73-9.82,14.89-15.27,21.86c-19.93,25.5-44.11,47.85-66.78,70.87c-12.18,12.36-26.75,23.91-36.35,38.52
	C282.33,344.19,287.22,360.11,287.22,373.14z"
      />
      <path
        className="st1"
        d="M151.9,352.89c-27.6-35.04-90.91-115.52-35.33-157.56c29.47-22.29,161.92-24.31,155.78,34.89"
      />
      <linearGradient
        id="SVGID_2_"
        gradientUnits="userSpaceOnUse"
        x1="172.526"
        y1="253.8764"
        x2="327.9729"
        y2="417.1882"
      >
        <stop offset="0" style={{ stopColor: "#404040" }} />
        <stop offset="0.1156" style={{ stopColor: "#474643" }} />
        <stop offset="0.6608" style={{ stopColor: "#625E50" }} />
        <stop offset="0.9804" style={{ stopColor: "#6C6755" }} />
      </linearGradient>
      <path
        className="st2"
        d="M274.78,382.11H157.44c-7.24,0-13.11-5.87-13.11-13.11V230.33c0-7.24,5.87-13.11,13.11-13.11h117.33
	c7.24,0,13.11,5.87,13.11,13.11V369C287.89,376.24,282.02,382.11,274.78,382.11z"
      />
      <rect
        style={{ transition: "y 0.2s, height 0.2s" }}
        x="150"
        y={currentValue ? 225 + 152 - (currentValue.volume * 152) / 100 : 225}
        width="132px"
        height={currentValue ? (currentValue.volume * 152) / 100 + "px" : "0px"}
        rx="20"
        fill="rgba(0,0, 255, 0.4)"
      />
      <g
        style={{
          display: currentValue && currentValue.tilt > 52 ? "unset" : "none",
          transformOrigin: "50% 50%",
          transform: "translate(195px, 30px) scale(0.2) rotate(-15deg)"
        }}
      >
        <g>
          <path
            className="st3"
            d="M180.89,273.94c-6.22,3.84-10.45,4.46-24.93,4.13c-2.6-0.06-8.89-1.21-11.07-2.18
		c-6.51-2.87-11.22-9.15-14.56-15.18c-3.88-7.01-4.99-21.48-5.51-28.62c-0.35-4.89,5.08-27.06,9.19-41.03
		c4.34-14.75,10.74-39.22,12.48-45.4c6.83-24.28-0.66-38.13,0.28-51.24c0.04-0.52,0.19-0.86,0.45-1.03
		c2.68-1.8,16.52,14.74,23.46,29.66c24.22,52,32.2,61.55,34.49,91.12c0.64,8.2-0.68,22.7-4.3,32.59
		C193.54,266.78,187.75,269.71,180.89,273.94z"
          />
          <path
            className="st4"
            d="M144.89,275.89c-6.51-2.87-11.22-9.15-14.56-15.18c-3.88-7.01-5.29-21.45-5.51-28.62
		c-0.14-4.45,5.08-27.06,9.19-41.03c4.34-14.75,10.74-39.22,12.48-45.4c6.83-24.28-0.66-38.13,0.28-51.24
		c0.04-0.52,0.19-0.86,0.45-1.03c3.73,9.1,13.11,22.99,9.29,48.76C153.04,165.48,126.78,233.06,144.89,275.89z"
          />
          <path
            className="st4"
            d="M159.15,278.13c0,0-6.96,0.45-14.26-2.24c-7.3-2.69-8.2-54.49-8.2-54.49l2.79-21.59
		C136.15,235.2,138.91,266.79,159.15,278.13z"
          />
          <path
            className="st5"
            d="M198.08,221.59c0,0,0.81,3.05-0.91,12.23c-1.78,9.48-4.61,14.79-7.81,20.91c-2.36,4.51-5.74,8.01-11.49,12.01"
          />
        </g>
        <g>
          <path
            className="st3"
            d="M396.86,97c0.91,9.4-0.81,14.81-9.61,32.07c-1.58,3.1-6.57,10.09-8.98,12.23c-7.15,6.4-17.26,8.92-26.29,9.92
		c-10.49,1.16-28.15-4.74-36.84-7.68c-5.95-2.02-28.87-19.65-42.91-31.58c-14.82-12.6-39.88-32.54-46.14-37.73
		c-24.58-20.36-45.21-18.28-60.08-25.96c-0.6-0.31-0.9-0.66-0.95-1.06c-0.57-4.12,26.91-12.5,48.47-13.4
		c75.18-3.14,91.03-7.96,127.12,4.07c10.01,3.34,26.29,12.17,35.82,21.47C395.77,78.2,395.86,86.63,396.86,97z"
          />
          <path
            className="st4"
            d="M378.27,141.3c-7.15,6.4-17.26,8.92-26.29,9.92c-10.49,1.16-28.28-4.37-36.84-7.68
		c-5.31-2.06-28.87-19.65-42.91-31.58c-14.82-12.6-39.88-32.54-46.14-37.73c-24.58-20.36-45.21-18.28-60.08-25.96
		c-0.6-0.31-0.9-0.66-0.95-1.06c12.86,0.06,34.64-4.27,62.71,13.22C253.2,76.25,317.42,141.66,378.27,141.3z"
          />
          <path
            className="st4"
            d="M389.17,125.25c0,0-3.5,8.6-10.9,16.04c-7.4,7.44-68.82-17.39-68.82-17.39l-23.76-14.15
		C325.37,131.46,364.12,143.94,389.17,125.25z"
          />
          <path
            className="st5"
            d="M345.29,50.12c0,0,4.06,0.56,13.85,7.22c10.11,6.88,14.72,12.94,20.06,19.86c3.94,5.1,6.09,10.91,7.45,19.84"
          />
        </g>
        <g>
          <path
            className="st3"
            d="M341.86,322.78c-7.33,9.17-13.54,12.5-36.31,20.27c-4.08,1.4-14.59,3.3-18.59,3.13
		c-11.91-0.48-23.11-6.98-32.02-13.9c-10.36-8.04-20.99-28.58-26.19-38.73c-3.56-6.95-8.73-42.5-10.92-65.28
		c-2.31-24.05-7.39-63.51-8.48-73.56c-4.29-39.42-24.48-55.42-31.08-75.13c-0.27-0.79-0.23-1.37,0.07-1.77
		c3.06-4.17,34.8,12.15,54.79,30c69.73,62.26,88.02,71.68,109.79,113.63c6.03,11.63,12.9,33.6,13.35,50.13
		C357.16,305.08,349.94,312.67,341.86,322.78z"
          />
          <path
            className="st4"
            d="M286.96,346.18c-11.91-0.48-23.11-6.98-32.02-13.9c-10.36-8.04-21.43-28.37-26.19-38.73
		c-2.95-6.43-8.73-42.5-10.92-65.28c-2.31-24.05-7.39-63.51-8.48-73.56c-4.29-39.42-24.48-55.42-31.08-75.13
		c-0.27-0.79-0.23-1.37,0.07-1.77c11.41,11.18,34.57,26.16,44.46,66.04C231.76,179.98,232.41,293.85,286.96,346.18z"
          />
          <path
            className="st4"
            d="M310.56,341.32c0,0-10.57,4.64-23.6,4.87c-13.03,0.23-46.29-75.05-46.29-75.05l-8.93-33.18
		C248.32,291.63,272.06,336.29,310.56,341.32z"
          />
          <path
            className="st5"
            d="M336.46,236.38c0,0,3.14,4.01,6.1,18.42c3.06,14.88,1.92,24.28,0.7,35.06c-0.9,7.95-4.02,14.99-10.53,24.13"
          />
        </g>
      </g>
    </>
  );
};

export default WateringCanView;
