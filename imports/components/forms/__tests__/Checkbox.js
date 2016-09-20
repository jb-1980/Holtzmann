import renderer from "react-test-renderer";
import Checkbox from "../Checkbox";

it("should exist", () => {
  const checkbox = renderer.create(<Checkbox />);
  expect(checkbox).toMatchSnapshot();
});

it("should accept props", () => {
  const checkbox = renderer.create(
    <Checkbox
      validation={() => {}}
      status="test2"
      disabled
      errorText="test4"
      error
      classes={["test5"]}
      id="test7"
      defaultValue="checked"
      clicked={() => {}}
      style="test9"
      inputClasses={["test10", "test11"]}/>);
  expect(checkbox).toMatchSnapshot();
});
