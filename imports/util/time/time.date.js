import Moment from "moment";

function date(contentItem) {
  // Dec 19, 2015
  let date = contentItem.meta.actualDate;

  return Moment(new Date(date)).format("MMM D, YYYY");

}

export default date;
