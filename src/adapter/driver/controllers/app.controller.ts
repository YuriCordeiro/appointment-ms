import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() { }

  @Get()
  redirectToSwagger(@Res() res) {
    return res.redirect('/api#');
  }
}
