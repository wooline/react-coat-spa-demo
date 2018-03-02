import model from "./core/store"; // must be first
// tslint:disable-next-line:ordered-imports
import { components as appComponents } from "modules/app";
import { createApp } from "react-coat";

createApp(model, appComponents.Main, "root");
