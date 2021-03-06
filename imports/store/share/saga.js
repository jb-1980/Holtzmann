
import "regenerator-runtime/runtime";
import { takeLatest } from "redux-saga";
import { fork, put, cps, select } from "redux-saga/effects";
import { addSaga } from "../utilities";


function* share({ payload }) {
  let { share } = yield select();
  let msg = {};

  for (let key in share.content) {
    if (share.content[key] != null ) {
      msg[key] = share.content[key];
    }
  }

  // this is a temporary speed bump
  if (msg.image) delete msg.image;

  if (
    typeof window != "undefined" &&
    window != null &&
    window.socialmessage &&
    Object.keys(msg).length
  ) {

    if (msg.image && msg.image[0] === "/") {
      msg.image = "http:" + msg.image;
    }

    window.socialmessage.send(msg);
  }

}

addSaga(function* shareSaga() {
  yield fork(takeLatest, "SHARE.SHARE", share);
});
