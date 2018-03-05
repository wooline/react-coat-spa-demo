import * as React from "react";
import { connect } from "react-redux";

const component = (...args: any[]) => {
  return <div>abcdefg</div>;
};

export default connect()(component);
