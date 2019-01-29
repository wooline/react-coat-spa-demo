import {Carousel, Icon as MIcon} from "antd-mobile";
import {toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {ItemDetail, ListSearch} from "entity/photo";
import {RootState, RouterData} from "modules";
import {Main as Comments} from "modules/comments/views";
import {ModuleNames} from "modules/names";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  pathname: string;
  searchData: RouterData["searchData"];
  showComment: boolean;
  listSearch: ListSearch | undefined;
  itemDetail: ItemDetail | undefined;
}

interface State {
  moreDetail: boolean;
}

class Component extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
    if (!nextProps.itemDetail && prevState.moreDetail) {
      return {moreDetail: false};
    }
    return null;
  }
  public state: State = {
    moreDetail: false,
  };

  private moreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };
  private onClose = () => {
    const {dispatch, listSearch} = this.props;
    const listPath = toPath(ModuleNames.photos, "Main");
    const url = toUrl(listPath, {[ModuleNames.photos]: {search: listSearch, showComment: false}}, null);
    dispatch(routerActions.push(url));
  };
  private onShowComment = () => {
    const {dispatch, searchData, pathname, showComment} = this.props;
    const url = toUrl(pathname, {...searchData, [ModuleNames.photos]: {showComment: !showComment}}, null);
    dispatch(routerActions.push(url));
  };
  public render() {
    const {showComment, itemDetail} = this.props;
    const {moreDetail} = this.state;
    if (itemDetail) {
      return (
        <div className={`${ModuleNames.photos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2>{itemDetail.title}</h2>
            <span onClick={this.onClose} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </span>
          </div>
          <div className={"remark" + (moreDetail ? " on" : "")} onClick={this.moreRemark}>
            {itemDetail.remark}
          </div>
          <div className="content">
            <Carousel className="player" autoplay={false} infinite={true}>
              {itemDetail.picList.map(url => (
                <div className="g-pre-img" key={url}>
                  <div className="pic" style={{backgroundImage: `url(${url})`}} />
                </div>
              ))}
            </Carousel>
          </div>

          <div onClick={this.onShowComment} className="comment-bar">
            <span>
              <Icon type={IconClass.HEART} />
              <br />
              {itemDetail.hot}
            </span>
            <span>
              <Icon type={IconClass.MESSAGE} />
              <br />
              {itemDetail.comments}
            </span>
          </div>
          <div className={"comments-panel" + (showComment ? " on" : "")}>
            <div onClick={this.onShowComment} className="mask" />
            <div className="dialog">
              <Comments />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  private fadeIn() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf("g-enter-in") > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace("g-enter-in", "");
      }, 0);
    }
  }
  public componentDidUpdate() {
    this.fadeIn();
  }
  public componentDidMount() {
    this.fadeIn();
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos!;
  return {
    pathname: state.router.location.pathname,
    searchData: state.router.searchData,
    showComment: Boolean(model.showComment),
    listSearch: model.listSearch,
    itemDetail: model.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
