import { Test, TestingModule } from '@nestjs/testing';
import { ActiveLogController } from './active-log.controller';
import { ActiveLogService } from './active-log.service';

describe('ActiveLogController', () => {
  let controller: ActiveLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveLogController],
      providers: [ActiveLogService],
    }).compile();

    controller = module.get<ActiveLogController>(ActiveLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
