import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
  ValidateIf,
  isDefined,
} from 'class-validator';

// https://github.com/typestack/class-validator/issues/245

// Define new constraint that checks the existence of sibling properties
@ValidatorConstraint({ async: false, name: 'IsNotSiblingOf' })
class IsNotSiblingOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (isDefined(value)) {
      return this.getFailedConstraints(args).length === 0;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const properties = '"' + this.getFailedConstraints(args).join('", "') + '"';

    return `"${args.property}" cannot exist alongside the following defined properties: ${properties}`;
  }

  getFailedConstraints(args: ValidationArguments) {
    return args.constraints.filter((prop) =>
      isDefined((args.object as any)[prop]),
    );
  }
}

// Helper function for determining if a prop should be validated
function incompatibleSiblingsNotPresent(incompatibleSiblings: string[]) {
  return function (object: any, value: any) {
    return Boolean(
      // Validate if prop has value // Validate if all incompatible siblings are not defined
      isDefined(value) ||
        incompatibleSiblings.every((prop) => !isDefined(object[prop])),
    );
  };
}

// Create Decorator for the constraint that was just created
export const IsNotSiblingOf = (
  incompatibleSiblings: string[],
  validationOptions?: ValidationOptions,
) => {
  const notSibling = (target: Record<string, any>, key: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName: key,
      options: validationOptions,
      constraints: incompatibleSiblings,
      validator: IsNotSiblingOfConstraint,
    });
  };

  const validateIf = ValidateIf(
    incompatibleSiblingsNotPresent(incompatibleSiblings),
  );

  return (target: Record<string, any>, key: string) => {
    notSibling(target, key);
    validateIf(target, key);
  };
};
