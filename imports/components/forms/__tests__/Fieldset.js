import renderer from "react-test-renderer";
import FieldSet from "../Fieldset";

it("should exist", () => {
  const fieldset = renderer.create(<FieldSet />);
  expect(fieldset).toMatchSnapshot();
});

it("should accept props", () => {
  const fieldset = renderer.create(<FieldSet classes={["class", "class2"]}/>);
  expect(fieldset).toMatchSnapshot();
});

it ('should accept children', () => {
  const fieldset = renderer.create(<FieldSet><p>hello</p></FieldSet>);
  expect(fieldset).toMatchSnapshot();
});