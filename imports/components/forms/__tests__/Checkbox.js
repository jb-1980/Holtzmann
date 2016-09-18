import renderer from "react-test-renderer";
import Checkbox from "../Checkbox";

it("should exist", () => {
  const checkbox = renderer.create(<Checkbox />);
  expect(checkbox).toMatchSnapshot();
});

it("should accept props", () => {
  const checkbox = renderer.create(<Checkbox validation="test" status="test2" disabled errorText="test4" error classes="test6" id="test7" defaultValue clicked="test8" style="test9"/>);
  expect(checkbox).toMatchSnapshot();
});