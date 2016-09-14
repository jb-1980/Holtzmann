import renderer from "react-test-renderer";
import FieldSet from "../Fieldset";

it("displays an empty fieldset to the user", () => {
  const tree = renderer.create(<FieldSet />);
  expect(tree).toMatchSnapshot();
});

it("displays an empty fieldset, with classes to the user", () => {
  const tree = renderer.create(<FieldSet classes="foo" />);
  expect(tree).toMatchSnapshot();
});

it("displays an empty fieldset, with classes to the user", () => {
  const tree = renderer.create(<FieldSet classes="foo" />);
  expect(tree).toMatchSnapshot();
});