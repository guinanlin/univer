import { ErrorType } from '../basics/error-type';
import { ErrorValueObject } from '../other-object/error-value-object';
import { FunctionVariantType } from '../reference-object/base-reference-object';
import { BaseFunction } from './base-function';

export class Power extends BaseFunction {
    override calculate(numberVar: FunctionVariantType, powerVar: FunctionVariantType) {
        return ErrorValueObject.create(ErrorType.VALUE);
    }
}
