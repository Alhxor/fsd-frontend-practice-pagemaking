const chai = require("chai");
const sinon = require("sinon");
chai.should();

import { expect } from "chai";
import { subscribe, dispatch } from "./events.js";

describe("Events utility", () => {
  it("subscribe is a function", () => {
    subscribe.should.be.a("function");
  });

  it("dispatch is a function", () => {
    dispatch.should.be.a("function");
  });

  let listener = sinon.spy();

  it('subscribe("newId", listener) returns undefined', () => {
    expect(subscribe("newId", listener)).to.equal(undefined);
  });

  it('dispatch("newId") calls listener once', () => {
    dispatch("newId");
    expect(listener.calledOnce).to.be.true;
  });
});
