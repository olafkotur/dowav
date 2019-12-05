import React from "react";
import { shallow, mount } from "enzyme";
import HistoryList from "./HistoryList";
import LocationDataContext from "../context/LocationDataContext";
import moment from "moment";

describe("<HistoryList/>", () => {
  it("Renders without crash", () => {
    const mockFn = jest.fn();
    const wrapper = mount(
      <LocationDataContext.Provider
        value={{
          data: [{ time: Date.now(), value: 0 }],
          appendData: mockFn
        }}
      >
        <HistoryList />
      </LocationDataContext.Provider>
    );

    expect(wrapper.find("h1").text()).toEqual("History");
    expect(wrapper.find(".historic-item").length).toEqual(1);
  });
  it("Doesn't render anything if there is no data provided.", () => {
    const mockFn = jest.fn();
    const wrapper = mount(
      <LocationDataContext.Provider
        value={{
          data: [{ time: Date.now(), value: 0 }],
          appendData: mockFn
        }}
      >
        <HistoryList />
      </LocationDataContext.Provider>
    );
    expect(wrapper.find(".istoric-item-list").children().length).toEqual(0);
  });

  it("Renders the correct format of the date", () => {
    const mockFn = jest.fn();
    const time = Date.now();
    const wrapper = mount(
      <LocationDataContext.Provider
        value={{
          data: [{ time: time, value: 0 }],
          appendData: mockFn
        }}
      >
        <HistoryList />
      </LocationDataContext.Provider>
    );

    let reg = new RegExp(moment(time).format("D MMM HH:mm:ss"));
    expect(wrapper.find(".historic-item-list").text()).toMatch(reg);
  });

  it("Expect to have 'No Location' message when location value is 0", () => {
    const mockFn = jest.fn();
    const time = Date.now();
    const wrapper = mount(
      <LocationDataContext.Provider
        value={{
          data: [{ time: time, value: 0 }],
          appendData: mockFn
        }}
      >
        <HistoryList />
      </LocationDataContext.Provider>
    );

    let reg = new RegExp("No Location");
    expect(wrapper.find(".historic-item-list").text()).toMatch(reg);
  });
});
