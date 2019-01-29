import {Icon, NavBar} from "antd-mobile";
import {toUrl} from "common/routers";
import {routerActions} from "connected-react-router";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  searchData: RouterData["searchData"];
  avatarUrl: string;
  logoUrl: string;
}

class Component extends React.PureComponent<Props> {
  private onShowSearch = () => {
    const {pathname, showSearch, searchData, dispatch} = this.props;
    const url = toUrl(pathname, {...searchData, [ModuleNames.app]: {...searchData.app, showSearch: !showSearch}}, null);
    dispatch(routerActions.push(url));
  };

  public render() {
    const {logoUrl, avatarUrl} = this.props;
    return (
      <div className="app-TopNav g-doc-width">
        <NavBar
          icon={<span className="avatar" style={{backgroundImage: `url(${avatarUrl})`}} />}
          rightContent={
            <div onClick={this.onShowSearch}>
              <Icon type="search" />
            </div>
          }
        >
          <img src={logoUrl} className="logo" />
        </NavBar>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
    searchData: state.router.searchData,
    showSearch: Boolean(state.app!.showSearch),
    logoUrl: state.app!.projectConfig!.logoUrl,
    avatarUrl: state.app!.curUser!.avatarUrl,
  };
};

export default connect(mapStateToProps)(Component);
