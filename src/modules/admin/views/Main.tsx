import * as React from "react";
import { connect } from "react-redux";

const component = (...args: any[]) => {
  return <div>abcde</div>;
};

export default connect()(component);
