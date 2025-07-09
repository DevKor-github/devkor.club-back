import { Position } from "@common/shared/enums/position.enum";
import { BadRequestException } from "@nestjs/common";

export class BlogMapper {
  static toPosition(positionString: string | null): Position {
    if (!positionString) {
      throw new BadRequestException("Position is required");
    }

    const positionMap: Record<string, Position> = {
      BE: Position.BE,
      FE: Position.FE,
      PM: Position.PM,
      PD: Position.PD,
      DevOps: Position.DevOps,
    };

    const position = positionMap[positionString];

    if (!position) {
      throw new BadRequestException(`Invalid position: ${positionString}`);
    }

    return position;
  }
}
