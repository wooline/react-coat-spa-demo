import {Pagination} from "antd-mobile";
import {toPath, toUrl} from "common/routers";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary, PathData} from "entity/comment";
import {RootState, RouterData} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  pathname: string;
  pathData: PathData;
  searchData: RouterData["searchData"];
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = NaN;

class Component extends React.PureComponent<Props> {
  private onPageChange = (page: number) => {
    const {dispatch, pathname, searchData, listSearch} = this.props;
    const url = toUrl(pathname, {...searchData, [ModuleNames.comments]: {search: {...listSearch, page}}}, null);
    dispatch(routerActions.push(url));
  };

  private onSortChange = (isNewest: boolean) => {
    const {dispatch, pathname, searchData, listSearch} = this.props;
    const url = toUrl(pathname, {...searchData, [ModuleNames.comments]: {search: {...listSearch, page: 1, isNewest}}}, null);
    dispatch(routerActions.push(url));
  };

  private onItemClick = (itemId: string) => {
    // 记住当前滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    scrollTop = (dom.parentNode as HTMLDivElement).scrollTop;
    const {
      dispatch,
      searchData,
      pathData: {type, typeId},
    } = this.props;
    const detailsPath = toPath(ModuleNames.comments, "Details", {type, typeId, itemId});
    const url = toUrl(detailsPath, {...searchData, [ModuleNames.comments]: {}}, null);
    dispatch(routerActions.push(url));
  };

  public render() {
    const {listSearch, listItems, listSummary} = this.props;
    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.comments}-List`}>
          <div className="list-header">
            <div onClick={() => this.onSortChange(false)} className={listSearch.isNewest ? "" : "on"}>
              最热
            </div>
            <div onClick={() => this.onSortChange(true)} className={listSearch.isNewest ? "on" : ""}>
              最新
            </div>
          </div>
          <div className="list-items">
            {listItems.map(item => (
              <div onClick={() => this.onItemClick(item.id)} className="g-border-top" key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
                <span className="reply">
                  <span className="act">回复</span>({item.replies})
                </span>
              </div>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination current={listSummary.page} total={listSummary.totalPages} onChange={this.onPageChange} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidUpdate() {
    this.scroll();
  }
  public componentDidMount() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = scrollTop;
      scrollTop = 0;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.comments!;
  const {
    pathData,
    searchData,
    location: {pathname},
  } = state.router;
  return {
    pathname,
    searchData,
    pathData: pathData[ModuleNames.comments]!,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
