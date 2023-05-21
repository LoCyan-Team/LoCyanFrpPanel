import Clipboard from "clipboard";
import { SendSuccessMessage, SendErrorMessage } from "./message";

function clipboardSuccess(msg) {
  SendSuccessMessage(msg || "复制成功");
}

function clipboardError(msg) {
  SendErrorMessage(msg || "嗯...发生了点小错误");
}

export default function handleClipboard(text, event, msg) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  });
  clipboard.on("success", () => {
    clipboardSuccess(msg);
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    clipboardError(msg);
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
