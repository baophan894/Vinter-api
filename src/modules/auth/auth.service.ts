import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
   constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    let user = await this.userService.findByGoogleId(id);

    if (!user) {
      user = await this.userService.create({
        googleId: id,
        email: emails[0].value,
        name: displayName,
        photo: photos[0].value,
        role: 'User', 
      });
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }
}
