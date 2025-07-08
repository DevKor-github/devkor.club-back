import { ControllerResponse } from "@common/shared/response/controller.response";
import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

type SwaggerPrimitive =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

export const ApiResponseType = <
  TModel extends Type<any> | SwaggerPrimitive | void
>(
  model: TModel
) => {
  const isVoid = model === undefined || model === (void 0 as any);
  const isPrimitive = model === String || model === Number || model === Boolean;

  const schema: any = {
    allOf: [{ $ref: getSchemaPath(ControllerResponse) }],
  };

  if (!isVoid) {
    schema.allOf.push({
      properties: {
        data: isPrimitive
          ? { type: primitiveToSwaggerType(model as SwaggerPrimitive) }
          : { $ref: getSchemaPath(model as Type<any>) },
      },
    });
  }

  return applyDecorators(
    ApiExtraModels(
      ControllerResponse,
      ...(isVoid || isPrimitive ? [] : [model as Type<any>])
    ),
    ApiOkResponse({ schema })
  );
};

function primitiveToSwaggerType(
  type: SwaggerPrimitive
): "string" | "number" | "boolean" {
  switch (type) {
    case String:
      return "string";
    case Number:
      return "number";
    case Boolean:
      return "boolean";
    default:
      throw new Error(`Unsupported primitive type: ${type}`);
  }
}
