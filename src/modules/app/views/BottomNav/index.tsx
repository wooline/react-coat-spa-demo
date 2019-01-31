import {TabBar} from "antd-mobile";
import {UnauthorizedError} from "common/Errors";
import {toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {errorAction} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  hasLogin: boolean;
  views: RootState["views"];
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {views, dispatch} = this.props;
    const photosUrl = toUrl(toPath(ModuleNames.photos, "Main"), null, {app: {refresh: true}});
    const videosUrl = toUrl(toPath(ModuleNames.videos, "Main"), null, {app: {refresh: true}});
    const messagesUrl = toUrl(toPath(ModuleNames.messages, "Main"), null, {app: {refresh: true}});

    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={<Icon type={IconClass.PICTURE} />}
            selectedIcon={<Icon type={IconClass.PICTURE} />}
            title="组团"
            key="photos"
            selected={!!views.photos}
            onPress={() => {
              dispatch(routerActions.push(photosUrl));
            }}
          />
          <TabBar.Item
            title="分享"
            key="videos"
            icon={<Icon type={IconClass.LIVE} />}
            selectedIcon={<Icon type={IconClass.LIVE} />}
            selected={!!views.videos}
            onPress={() => {
              dispatch(routerActions.push(videosUrl));
            }}
          />
          <TabBar.Item
            icon={<Icon type={IconClass.MESSAGE} />}
            selectedIcon={<Icon type={IconClass.MESSAGE} />}
            title="消息"
            key="messages"
            selected={!!views.messages}
            onPress={() => {
              if (!this.props.hasLogin) {
                this.props.dispatch(errorAction(new UnauthorizedError()));
              } else {
                dispatch(routerActions.push(messagesUrl));
              }
            }}
          />
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    hasLogin: state.app!.curUser!.hasLogin,
    views: state.views,
  };
};

export default connect(mapStateToProps)(Component);
