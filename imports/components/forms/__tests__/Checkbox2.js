import TestUtils from "react-addons-test-utils";
import Checkbox from "../Checkbox";

it ('should run click handler', () => {
  var spy = jest.fn();
  const checkbox = TestUtils.renderIntoDocument(
      <Checkbox clicked={spy} />
  );

  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(checkbox, 'input');
  const input = inputs[0];

  TestUtils.Simulate.click(input);
  expect(spy).toBeCalled();
});