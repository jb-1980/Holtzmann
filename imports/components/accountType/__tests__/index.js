import renderer from "react-test-renderer";
import AccountType from "../index";

it("should exist", () => {
  const accountType = renderer.create(<AccountType type="American Express" />);
  expect(accountType).toMatchSnapshot();

  const ach = renderer.create(<AccountType type="ACH" />);
  expect(ach).toMatchSnapshot();
});

it ('should show different icons for AmEx and ACH', () => {
  const amEx = renderer.create(<AccountType type="American Express" />);
  const ach = renderer.create(<AccountType type="ACH" />);

  const amExJSON = amEx.toJSON();
  const achJSON = ach.toJSON();

  expect(amExJSON).not.toBe(achJSON);
});

it ('should allow custom height and width', () => {
  const accountType = renderer.create(<AccountType width="105" height="106" type="ACH" />);
  const json = accountType.toJSON();

  expect(json.props.style.width).toBe('105');
  expect(json.props.style.height).toBe('106');

  // TODO: fails for reason https://github.com/NewSpring/Holtzmann/issues/1133
  // expect(json.props.style.marginBottom).toBe('-10.6px');
});
