import { Injectable } from '@nestjs/common';
import { CreateActiveLogDto } from './dto/create-active-log.dto';
import { UpdateActiveLogDto } from './dto/update-active-log.dto';

@Injectable()
export class ActiveLogService {
  create(createActiveLogDto: CreateActiveLogDto) {
    return 'This action adds a new activeLog';
  }

  findAll() {
    return `This action returns all activeLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activeLog`;
  }

  update(id: number, updateActiveLogDto: UpdateActiveLogDto) {
    return `This action updates a #${id} activeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} activeLog`;
  }
}
