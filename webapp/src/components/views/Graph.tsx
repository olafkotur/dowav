import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  IViewport,
  HistoryData,
  IHistoryData,
  GraphConfiguration,
  TimePeriod
} from "../../types";
import * as d3 from "d3";
import ControlPane from "../ControlPane";
import D3Graph from "../../d3/d3Graph";

type GraphProps = {
  viewport: IViewport;
  data: HistoryData;
  conf: GraphConfiguration;
  control?: {
    shouldRenderLive: boolean;
  };
};

const Graph: React.FC<GraphProps> = ({
  viewport,
  data,
  conf,
  control = { shouldRenderLive: true }
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<boolean>(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod[]>([
    { timePeriod: 5, selected: true },
    { timePeriod: 15, selected: false },
    { timePeriod: 30, selected: false }
  ]);
  const [d3chart, setD3chart] = useState<D3Graph | null>(null);

  useEffect(() => {
    if (data && d3chart && container.current) {
      d3chart.setData(data);
    }
  }, [data, d3chart]);

  useEffect(() => {
    if (d3chart) {
      d3chart.setConf(
        {
          ...conf,
          timePeriod: timePeriod.filter((t: TimePeriod) => t.selected)[0]
        },
        data
      );
    }
  }, [timePeriod]);

  useEffect(() => {
    if (d3chart) {
      d3chart.plot("start");
    }
  }, [d3chart]);

  useEffect(() => {
    return () => {
      let el = document.getElementById(conf.id);
      if (el && container.current) {
        container.current.removeChild(el);
      }
    };
  }, []);
  useEffect(() => {
    if (container.current) {
      let el = container.current;
      if (el.childNodes.length === 1) {
        d3.select(el)
          .append("svg")
          .attr("id", conf.id)
          .attr("width", viewport.width)
          .attr("height", viewport.height);
        const svg = document.getElementById(conf.id);
        if (svg) {
          const chart = new D3Graph({
            svg,
            viewport,
            data,
            conf: {
              ...conf,
              timePeriod: timePeriod.filter((t: TimePeriod) => t.selected)[0]
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
  }, [container.current]);

  useEffect(() => {
    if (container.current) {
      const svg = document.getElementById(conf.id);
      if (svg) {
        const rect = svg.getBoundingClientRect();
        if (rect.height !== viewport.height || rect.width !== viewport.width) {
          if (d3chart) {
            d3chart.setViewport(viewport);
          }
        }
      }
    }
  }, [viewport]);

  useEffect(() => {
    if (d3chart) {
      if (live) {
        d3chart.goLive();
        const id = setInterval(async () => {
          const json = await fetch(
            `http://dowav-api.herokuapp.com/api/live/${conf.name}`
          );
          const data = await json.json();
          if (conf.zone) {
            d3chart.addLiveData(data[conf.zone - 1]);
          } else {
            console.error(
              "Please specify zone for Graphh with name " + conf.name
            );
          }
        }, 2000);
        return () => {
          clearInterval(id);
        };
      }
    }
  }, [d3chart, live]);

  return (
    <div className={`graph ${conf.name} ${live ? "live" : ""}`}>
      <div ref={container}>
        <ControlPane
          shouldRenderLive={control.shouldRenderLive}
          live={live}
          setLive={() => {
            if (live && d3chart) {
              d3chart.goHistory();
            }
            setLive(!live);
          }}
          setTimePeriod={setTimePeriod}
          conf={{ ...conf, timePeriod: timePeriod }}
        />
      </div>
    </div>
  );
};

export default Graph;
