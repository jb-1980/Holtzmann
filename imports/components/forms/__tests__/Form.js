import renderer from "react-test-renderer";
import Form from "../Form";

it("should exist", () => {
  const form = renderer.create(<Form />);
  expect(form).toMatchSnapshot();
});

it ('accepts all props', () => {
  const form = renderer.create(<Form id="test1" submit="test2" classes="test3" action="test4" method="test5" style="test6" fieldsetTheme="test7"/>);

  expect(form).toMatchSnapshot();
});
