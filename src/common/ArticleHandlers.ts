import {ArticleResource} from "entity/article";
import ResourceHandlers from "./ResourceHandlers";

export default class Handlers<R extends ArticleResource, S extends R["State"]> extends ResourceHandlers<R, S> {}
