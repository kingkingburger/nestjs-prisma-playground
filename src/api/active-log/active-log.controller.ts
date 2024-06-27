import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActiveLogService } from './active-log.service';
import { CreateActiveLogDto } from './dto/create-active-log.dto';
import { UpdateActiveLogDto } from './dto/update-active-log.dto';

@Controller('active-log')
export class ActiveLogController {
  constructor(private readonly activeLogService: ActiveLogService) {}

  @Post()
  create(@Body() createActiveLogDto: CreateActiveLogDto) {
    return this.activeLogService.create(createActiveLogDto);
  }

  @Get()
  findAll() {
    return this.activeLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activeLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActiveLogDto: UpdateActiveLogDto) {
    return this.activeLogService.update(+id, updateActiveLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activeLogService.remove(+id);
  }
}
