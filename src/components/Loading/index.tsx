import React from "react";

import "./Loading.less";

const loadingIcon = require("./loading.gif");

interface Props {
  loading: string;
}

interface State {}

const Component = function(props: Props, state: State) {
  const { loading } = props;
  return loading === "Start" || loading === "Depth" ? (
    <div className={"comp-loading " + loading}>
      <div className="loading-icon">
        <img src={loadingIcon} />
      </div>
    </div>
  ) : null;
};
export default Component;
