import React from "react";

import "./Startup.less";

interface Props {}

interface State {}

const Component = function(props: Props, state: State) {
  return (
    <div className="comp-startup">
      <h3>Welcome,Please wait...</h3>
      <p>
        APP启动的时候，往往需要加载某些初始数据，比如站点设置、当前用户等，<br />在这些必要数据回来之前，常先展示一个启动页...
      </p>
    </div>
  );
};

export default Component;
