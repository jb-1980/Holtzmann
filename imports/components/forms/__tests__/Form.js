import renderer from "react-test-renderer";
import Form from "../Form";

it("should exist", () => {
  const form = renderer.create(<Form />);
  expect(form).toMatchSnapshot();
});

it ('accepts all props', () => {
  const fn = jest.fn();
  const form = renderer.create(<Form id="test1" submit={fn} classes="test3" action="hello" method="test5" style={{display: "block"}} fieldsetTheme="test7"/>);

  expect(form).toMatchSnapshot();
});
