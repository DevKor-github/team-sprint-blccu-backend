import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isNumber,
} from 'class-validator';

export function IsNumberWithMessage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberWithMessage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value, validationArguments) {
          return isNumber(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a number, but received ${typeof args.value}`;
        },
      },
    });
  };
}
