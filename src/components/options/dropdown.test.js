const rewire = require("rewire");
const sinon = require("sinon");
const chai = require("chai");
const should = chai.should();

// const dropdown = require("./dropdown.js")
import { Dropdown } from "./dropdown.js.js";

// const dropdown = rewire("./dropdown.js");

// const changeValueByOne = dropdown.__get__("changeValueByOne");

describe("Dropdown component", () => {
  it("exists", () => {
    Dropdown.should.be.a("function");
  });
  // describe("Helper changeValueByOne", () => {
  //   let btn = {
  //     classList: {
  //       add: sinon.fake(),
  //       remove: sinon.fake(),
  //     },
  //   };

  //   let val = { textContent: "5" };

  //   it("Increments correctly", () => {
  //     changeValueByOne(btn, val, true);
  //     btn.textContent.should.equal("6");
  //   });
  // });
});
