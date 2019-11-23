import React, { useRef, useState, useEffect, useContext } from "react";
import { IViewport } from "../types";
import Lab3D from "../three/Lab3D";
import LocationDataContext from "../context/LocationDataContext";

type Lab3DModelProps = {
  viewport: IViewport;
};

const Lab3DModel: React.FC<Lab3DModelProps> = ({ viewport }) => {
  const container = useRef<HTMLDivElement>(null);
  const [lab3d, setLab3d] = useState<Lab3D | null>(null);
  const { data, appendData } = useContext(LocationDataContext);

  useEffect(() => {
    if (container.current && !lab3d) {
      setLab3d(new Lab3D({ viewport, container: container.current }));
    }
  }, [container.current]);

  useEffect(() => {
    if (lab3d) {
      lab3d.updateViewport(viewport);
    }
  }, [viewport]);

  useEffect(() => {
    if (data.length > 0 && lab3d) {
      let last = data[data.length - 1];
      lab3d.addLocationData(last);
      let id = setInterval(async () => {
        try {
          const response = await fetch(
            "https://dowav-api.herokuapp.com/api/location/live"
          );
          const json = await response.json();
          appendData(json);
        } catch (err) {
          console.log(err);
        }
      }, 500);
      return () => {
        clearInterval(id);
      };
    }
  }, [data, lab3d]);

  return (
    <div
      ref={container}
      style={{
        width: viewport.width,
        height: viewport.height,
        outline: "none"
      }}
    ></div>
  );
};

export default Lab3DModel;
