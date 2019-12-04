import React, { useRef, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

type TooltipProps = {
  text: string;
  position: { x: number; y: number };
  part: string;
};

const HealthStatus: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [rect, setRect] = useState<ClientRect | DOMRect | null>(null);
  const [tooltip, setTooltip] = useState<null | TooltipProps>(null);
  const { data, loading, error } = useFetch({
    query: { endpoint: "/api/health" },
    refetch: 0,
    useCache: false
  });

  function generateTooltip(
    e: React.MouseEvent<SVGGElement, MouseEvent>,
    part: string
  ) {
    if (ref.current && data && selectedPlant !== null) {
      let dim = ref.current.getBoundingClientRect();
      let x = e.clientX - dim.left;
      let y = e.clientY - dim.top;
      setTooltip({
        position: { x, y },
        text: data.filter((d: any) => d === selectedPlant)[0][part],
        part
      });
    }
  }
  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, [ref.current]);

  useEffect(() => {
    if (data && data.length > 1) {
      setSelectedPlant(data[0]);
    }
  }, [data]);
  return (
    <>
      <div
        className="health-control-buttons"
        style={{ height: "5%", display: "flex", flexDirection: "row" }}
      >
        {data
          ? data.map((d: any) => {
              return (
                <div
                  className={`${d === selectedPlant ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedPlant(d);
                  }}
                >
                  {d.plant}
                </div>
              );
            })
          : null}
      </div>
      <svg style={{ width: "100%", height: "95%" }} ref={ref}>
        {rect ? (
          <g
            id="Layer_1"
            style={{
              transform: `translate(${(rect.width - 530) / 2 +
                "px"}, 100px) scale(1.3)`,
              transformOrigin: "center"
            }}
          >
            <g>
              <path
                className="svg-auto-0"
                d="M251.52,216.29c-106.04,0-192,99.19-192,221.55h384C443.52,315.48,357.55,216.29,251.52,216.29z"
              />
              <g
                className="plant-pod"
                onMouseEnter={e => {
                  generateTooltip(e, "soil");
                }}
                onMouseLeave={e => {
                  setTooltip(null);
                }}
              >
                <path
                  className="svg-auto-2"
                  d="M347.1,293.32H169.32v-8.65h169.73c4.45,0,8.05,3.6,8.05,8.05V293.32z"
                />
                <path
                  className="svg-auto-3"
                  d="M236.71,416.66c-11.72,0-21.73-8.46-23.69-20.01l-14.18-83.71h-21.06l17.77,104.89
			c1.96,11.56,11.97,20.01,23.69,20.01h57.9c11.76,0,21.79-8.51,23.71-20.11l0.33-1.98c-2.09,0.59-4.29,0.92-6.56,0.92H236.71z"
                />
                <path
                  className="svg-auto-4"
                  d="M256.76,395.58c-11.72,0-21.73-8.46-23.69-20.01l-10.61-62.63h-23.62l14.18,83.71
			c1.96,11.56,11.97,20.01,23.69,20.01h57.9c2.27,0,4.47-0.32,6.56-0.92l3.33-20.17H256.76z"
                />
                <path
                  className="svg-auto-5"
                  d="M254.78,355.37l-7.19-42.44h-25.13l10.61,62.63c1.96,11.56,11.97,20.01,23.69,20.01h47.74l3.34-20.19h-29.37
			C266.75,375.39,256.74,366.93,254.78,355.37z"
                />
                <path
                  className="svg-auto-6"
                  d="M247.59,312.94l7.19,42.44c1.96,11.56,11.97,20.01,23.69,20.01h29.37l10.32-62.45H247.59z"
                />
                <g>
                  <path
                    className="svg-auto-7"
                    d="M169.52,306.23c-7.84,0-14.19-6.35-14.19-14.19c0-2.49,0.64-4.83,1.77-6.86
				c-5.81,1.78-10.03,7.18-10.03,13.57v0c0,7.84,6.35,14.19,14.19,14.19h173.42c5.35,0,10-2.96,12.42-7.33
				c-1.32,0.4-2.72,0.62-4.16,0.62H169.52z"
                  />
                  <path
                    className="svg-auto-7"
                    d="M348.87,298.74c0,2.49-0.64,4.83-1.77,6.86"
                  />
                  <path
                    className="svg-auto-7"
                    d="M157.09,285.17c1.32-0.4,2.72-0.62,4.16-0.62h2.99v0"
                  />
                  <path
                    className="svg-auto-8"
                    d="M178.44,298.74c-7.84,0-14.19-6.35-14.19-14.19h-2.99c-1.45,0-2.85,0.22-4.16,0.62
				c-1.13,2.03-1.77,4.37-1.77,6.86c0,7.84,6.35,14.19,14.19,14.19h173.42c1.45,0,2.85-0.22,4.16-0.62
				c1.13-2.03,1.77-4.37,1.77-6.86H178.44z"
                  />
                  <path
                    className="svg-auto-7"
                    d="M164.24,284.55L164.24,284.55l6.33,0"
                  />
                  <path
                    className="svg-auto-7"
                    d="M347.18,292.03c1.07,2,1.69,4.28,1.69,6.71v0"
                  />
                  <path
                    className="svg-auto-9"
                    d="M170.58,284.55h-6.33c0,7.84,6.35,14.19,14.19,14.19h170.43v0c0-2.43-0.61-4.71-1.69-6.71h-164.1
				C177.67,292.03,172.97,289,170.58,284.55z"
                  />
                </g>
                <path
                  className="svg-auto-22"
                  d="M334.68,312.94H161.26c-7.84,0-14.19-6.35-14.19-14.19v0c0-7.84,6.35-14.19,14.19-14.19h173.42
			c7.84,0,14.19,6.35,14.19,14.19v0C348.87,306.58,342.52,312.94,334.68,312.94z"
                />
                <path
                  className="svg-auto-22"
                  d="M277.13,437.84h-57.9c-11.72,0-21.73-8.46-23.69-20.01l-17.77-104.89h140.39l-17.32,104.79
			C298.92,429.33,288.89,437.84,277.13,437.84z"
                />
              </g>
              <g
                className="leaves"
                onMouseLeave={e => {
                  setTooltip(null);
                }}
                onMouseEnter={e => {
                  generateTooltip(e, "leaf");
                }}
              >
                <path
                  className="svg-auto-10"
                  d="M334.71,199.65c-5.53,21.8-25.28,37.93-48.81,37.93h-32.45c-1.01,3.97-1.55,8.14-1.55,12.42v0h37.9
			c27.81,0,50.35-22.54,50.35-50.35v0H334.71z"
                />
                <path
                  className="svg-auto-20"
                  d="M334.71,199.65H320.5c-8.71,15.05-24.97,25.18-43.6,25.18h-18.24c-2.28,3.95-4.06,8.22-5.2,12.75h32.45
			C309.42,237.58,329.17,221.45,334.71,199.65z"
                />
                <path
                  className="svg-auto-2"
                  d="M258.66,224.82h18.24c18.64,0,34.89-10.13,43.6-25.18h-18.24C283.62,199.65,267.36,209.78,258.66,224.82z"
                />
                <path
                  className="svg-auto-10"
                  d="M163.46,171h-4.58c0,25.01,20.28,45.29,45.29,45.29h43.8c0-5.25-0.9-10.28-2.54-14.97H206.2
			C186.44,201.32,169.64,188.66,163.46,171z"
                />
                <path
                  className="svg-auto-20"
                  d="M206.2,187.13c-13.9,0-26.33-6.27-34.64-16.13h-8.1c6.18,17.66,22.98,30.32,42.75,30.32h39.22
			c-1.83-5.24-4.6-10.03-8.1-14.19H206.2z"
                />
                <path
                  className="svg-auto-2"
                  d="M206.2,187.13h31.12c-8.31-9.86-20.74-16.13-34.64-16.13h-31.12C179.87,180.86,192.3,187.13,206.2,187.13z"
                />
                <path
                  className="svg-auto-10"
                  d="M323.21,128.03c-6.28,19.91-24.9,34.35-46.89,34.35h-22.14c-1.48,4.67-2.28,9.65-2.28,14.81v0h26.32
			c27.15,0,49.16-22.01,49.16-49.16v0H323.21z"
                />
                <path
                  className="svg-auto-20"
                  d="M323.21,128.03h-6.39c-8.87,12.86-23.69,21.29-40.49,21.29h-15.75c-2.74,3.97-4.91,8.36-6.39,13.06h22.14
			C298.31,162.38,316.92,147.94,323.21,128.03z"
                />
                <path
                  className="svg-auto-2"
                  d="M260.57,149.32h15.75c16.8,0,31.62-8.43,40.49-21.29h-15.75C284.26,128.03,269.44,136.46,260.57,149.32z"
                />
                <path
                  className="svg-auto-10"
                  d="M217.84,129.94c-19.42,0-35.92-12.44-42.01-29.78h-2.51v0c0,24.59,19.93,44.52,44.52,44.52H250v0
			c0-5.17-0.89-10.12-2.51-14.74H217.84z"
                />
                <path
                  className="svg-auto-20"
                  d="M217.84,129.94h29.65c-1.84-5.25-4.64-10.05-8.19-14.19h-23.23c-13.54,0-25.66-6.05-33.82-15.59h-6.42
			C181.91,117.5,198.42,129.94,217.84,129.94z"
                />
                <path
                  className="svg-auto-2"
                  d="M205.48,100.16h-23.23c8.16,9.54,20.28,15.59,33.82,15.59h23.23C231.14,106.21,219.02,100.16,205.48,100.16z"
                />
                <path
                  className="svg-auto-10"
                  d="M301.25,42.24l-1.92,0.67c-0.52,11.37-7.82,21.81-19.23,25.77L248.01,79.8c-0.16,3.53,0.32,7.14,1.55,10.68h0
			l34.01-11.79C298.52,73.51,306.43,57.19,301.25,42.24z"
                />
                <path
                  className="svg-auto-20"
                  d="M299.33,42.91l-8.69,3.01c-2.76,8.05-9.05,14.8-17.72,17.8l-23.4,8.11c-0.87,2.55-1.39,5.23-1.52,7.96
			l32.09-11.13C291.51,64.72,298.81,54.28,299.33,42.91z"
                />
                <path
                  className="svg-auto-2"
                  d="M249.52,71.84l23.4-8.11c8.66-3,14.96-9.75,17.72-17.8l-23.4,8.11C258.57,57.04,252.28,63.79,249.52,71.84z"
                />
                <path
                  className="svg-auto-21"
                  d="M340.16,199.65h-37.9c-27.81,0-50.35,22.54-50.35,50.35v0h37.9C317.62,250,340.16,227.46,340.16,199.65
			L340.16,199.65z"
                />
                <path
                  className="svg-auto-21"
                  d="M158.88,171h43.8c25.01,0,45.29,20.28,45.29,45.29v0h-43.8C179.16,216.29,158.88,196.01,158.88,171
			L158.88,171z"
                />
                <path
                  className="svg-auto-21"
                  d="M327.39,128.03h-26.32c-27.15,0-49.16,22.01-49.16,49.16v0h26.32C305.38,177.19,327.39,155.18,327.39,128.03
			L327.39,128.03z"
                />
                <path
                  className="svg-auto-21"
                  d="M173.32,100.16h32.16c24.59,0,44.52,19.93,44.52,44.52v0h-32.16C193.25,144.68,173.32,124.75,173.32,100.16
			L173.32,100.16z"
                />
                <path
                  className="svg-auto-21"
                  d="M283.57,78.69l-34.01,11.79v0c-5.18-14.95,2.73-31.27,17.68-36.45l34.01-11.79v0
			C306.43,57.19,298.52,73.51,283.57,78.69z"
                />
              </g>
              <line
                className="svg-auto-21"
                x1="143.65"
                y1="437.84"
                x2="359.39"
                y2="437.84"
              />
              <line
                className="svg-auto-21"
                x1="370.74"
                y1="437.84"
                x2="430.61"
                y2="437.84"
              />
              <line
                className="svg-auto-21"
                x1="440.42"
                y1="437.84"
                x2="455.65"
                y2="437.84"
              />
              <line
                className="svg-auto-21"
                x1="121.84"
                y1="437.84"
                x2="75"
                y2="437.84"
              />
              <line
                className="svg-auto-21"
                x1="58.16"
                y1="437.84"
                x2="48.1"
                y2="437.84"
              />
              <line
                className="svg-auto-23"
                x1="250"
                y1="284.55"
                x2="250"
                y2="90.48"
                onMouseEnter={e => {
                  generateTooltip(e, "stem");
                }}
                onMouseLeave={e => {
                  setTooltip(null);
                }}
              />
            </g>
          </g>
        ) : null}
        {tooltip ? (
          <foreignObject
            style={{ pointerEvents: "none" }}
            width="350px"
            height="350px"
            x={tooltip.position.x}
            y={tooltip.position.y}
          >
            <div className="tooltip-foreign">
              <h4 style={{ textTransform: "capitalize" }}>{tooltip.part}</h4>
              <p>
                {tooltip.text === ""
                  ? "Nothing bad haven't been seen yet."
                  : tooltip.text}
              </p>
            </div>
          </foreignObject>
        ) : null}
      </svg>
    </>
  );
};

export default HealthStatus;
