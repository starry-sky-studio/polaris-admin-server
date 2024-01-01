import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
// import { CreateAuthDto } from './dto/create-auth.dto'
// import { UpdateAuthDto } from './dto/update-auth.dto'

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // login(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto)
  // }

  // @Post('signup')
  // signup(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto)
  // }
}
