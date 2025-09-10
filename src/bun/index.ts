import { BrowserWindow } from "electrobun/bun";

const win = new BrowserWindow({
  title: "Sophy Desktop",
  url: "views://main-ui/welcome.html",
  DocModalWindow: true
});