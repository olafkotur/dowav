import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("./three/Lab3D");
jest.mock("three/examples/jsm/loaders/GLTFLoader", () => {});
jest.mock("three/examples/jsm/controls/OrbitControls", () => {});
jest.mock("three", () => ({
  Scene: class Scene {
    add() {
      return;
    }
  },
  WebGLRenderer: class WebGlRenderer {
    render() {
      return;
    }
    setSize() {
      return;
    }
  }
  // And a lot more...
}));
