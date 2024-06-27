import { PartialType } from '@nestjs/swagger';
import { CreateActiveLogDto } from './create-active-log.dto';

export class UpdateActiveLogDto extends PartialType(CreateActiveLogDto) {}
