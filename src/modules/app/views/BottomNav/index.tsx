import {TabBar} from "antd-mobile";
import {UnauthorizedError} from "common/Errors";
import {isCur, toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import React from "react";
import {errorAction} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  hasLogin: boolean;
  views: RouterData["views"];
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {views, dispatch} = this.props;
    const photosUrl = toUrl(toPath(ModuleNames.photos), null, {app: {refresh: true}});
    const videosUrl = toUrl(toPath(ModuleNames.videos), null, {app: {refresh: true}});
    const messagesUrl = toUrl(toPath(ModuleNames.messages), null, {app: {refresh: true}});

    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={<Icon type={IconClass.PICTURE} />}
            selectedIcon={<Icon type={IconClass.PICTURE} />}
            title="组团"
            key="photos"
            selected={isCur(views, ModuleNames.photos)}
            onPress={() => {
              dispatch(routerActions.push(photosUrl));
            }}
          />
          <TabBar.Item
            title="分享"
            key="videos"
            icon={<Icon type={IconClass.LIVE} />}
            selectedIcon={<Icon type={IconClass.LIVE} />}
            selected={isCur(views, ModuleNames.videos)}
            onPress={() => {
              dispatch(routerActions.push(videosUrl));
            }}
          />
          <TabBar.Item
            icon={<Icon type={IconClass.MESSAGE} />}
            selectedIcon={<Icon type={IconClass.MESSAGE} />}
            title="消息"
            key="messages"
            selected={isCur(views, ModuleNames.messages)}
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
    views: state.router.views,
  };
};

export default connect(mapStateToProps)(Component);
