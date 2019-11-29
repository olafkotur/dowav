import d3Colors from "./d3Colors";

interface ID3LineGradients {
  [key: string]: (
    svg: any,
    viewport: { height: number; width: number },
    colorPallete: string
  ) => void;
}

function drawGradient(
  svg: any,
  viewport: { height: number; width: number },
  colorPallete: string
) {
  const data = [];
  const colors = d3Colors[colorPallete];
  for (let i = 0; i < colors.length; i++) {
    if (i === 0) {
      data.push({ offset: "0%", color: colors[i] });
    } else {
      data.push({
        offset: `${100 / (colors.length - i)}%`,
        color: colors[i]
      });
    }
  }
  let grad = svg.select("#linegradient");
  if (grad.empty()) {
    grad = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "linegradient")
      .attr("gradientUnits", "userSpaceOnUse");
  }
  grad
    .attr("x1", viewport.width / 2)
    .attr("y1", 0)
    .attr("x2", viewport.width / 2)
    .attr("y2", viewport.height)
    .selectAll("stop")
    .data(data)
    .enter()
    .append("stop")
    .attr("offset", function(d: any) {
      return d.offset;
    })
    .attr("stop-color", function(d: any) {
      return d.color;
    });
}

const d3LineGradients: ID3LineGradients = {
  drawGradient: drawGradient
};

export default d3LineGradients;
