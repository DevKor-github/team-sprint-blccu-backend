import {
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsStringWithMessage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringWithMessage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value, validationArguments) {
          return isString(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string, but received ${typeof args.value}`;
        },
      },
    });
  };
}
