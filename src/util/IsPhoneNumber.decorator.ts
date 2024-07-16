import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  isNumberString,
} from "class-validator";

@ValidatorConstraint({ name: "isPhoneNumber", async: false })
export class IsPhoneNumber implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /^01\d-\d{3,4}-\d{4}$/;
    return regex.test(text);
  }
  defaultMessage() {
    return "Invalid format. Please follow the format: 01X-XXXX-XXXX";
  }
}
