import {Pagination} from "antd-mobile";
import {toUrl} from "common/routers";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/message";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = 0;

class Component extends React.PureComponent<Props> {
  private onPageChange = (page: number) => {
    const {dispatch, pathname, listSearch} = this.props;
    const url = toUrl(pathname, {[ModuleNames.messages]: {search: {...listSearch, page}}}, null);
    dispatch(routerActions.push(url));
  };

  private onSearch = (title: string) => {
    const {dispatch, pathname} = this.props;
    const url = toUrl(pathname, {[ModuleNames.app]: {showSearch: true}, [ModuleNames.messages]: {search: {title, page: 1}}}, null);
    dispatch(routerActions.push(url));
  };

  private onSearchClose = () => {
    const {dispatch, pathname} = this.props;
    const url = toUrl(pathname, {[ModuleNames.app]: {showSearch: false}, [ModuleNames.messages]: {search: {title: ""}}}, null);
    dispatch(routerActions.push(url));
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.messages}-List`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch || !!listSearch.title} />
          <div className="list-items">
            {listItems.map(item => (
              <div key={item.id}>
                <div className="author">{item.author}</div>
                <div className="date">{item.date.toUTCString()}</div>
                <div className="content">{item.content}</div>
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
  public componentDidMount() {
    this.scroll();
  }
  public componentDidUpdate() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.messages!;
  return {
    showSearch: Boolean(state.app!.showSearch),
    pathname: state.router.location.pathname,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
