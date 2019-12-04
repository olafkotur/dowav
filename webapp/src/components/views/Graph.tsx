import React, { useEffect, useRef, useState } from "react";
import {
  IViewport,
  HistoryData,
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
  }, [conf, d3chart, data, timePeriod]);

  useEffect(() => {
    if (d3chart) {
      d3chart.plot("start");
    }
  }, [d3chart]);

  useEffect(() => {
    return () => {
      let el = document.getElementById(conf.id);
      if (el && container.current) {
        // eslint-disable-next-line
        container.current.removeChild(el);
      }
    };
  }, [conf.id]);
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
  }, [conf, d3chart, data, timePeriod, viewport]);

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
  }, [conf.id, d3chart, viewport]);

  useEffect(() => {
    if (d3chart) {
      if (live) {
        d3chart.goLive();
        const id = setInterval(async () => {
          const json = await fetch(
            `https://dowav-api.herokuapp.com/api/live/${conf.name.toLowerCase()}`
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
  }, [conf.name, conf.zone, d3chart, live]);

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
          setTimePeriod={(d: TimePeriod[]) => {
            let se = 5;
            d.forEach(z => {
              if (z.selected) {
                se = z.timePeriod;
              }
            });
            let k = se / 5;
            if (data instanceof Array) {
              if (data.length > k * 2) setTimePeriod(d);
            } else if (typeof data === "object") {
              let keys = Object.keys(data);
              if (
                keys.every(i => {
                  return data[i].length > k * 2;
                })
              ) {
                setTimePeriod(d);
              }
            }
          }}
          conf={{ ...conf, timePeriod: timePeriod }}
        />
      </div>
    </div>
  );
};

export default Graph;
