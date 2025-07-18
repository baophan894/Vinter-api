import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchemaFactory } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: User.name,
      useFactory: UserSchemaFactory,
        inject: [],
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
