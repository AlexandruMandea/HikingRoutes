import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RoutesModule } from './modules/routes/routes.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { MY_SQL_PASSWORD, MY_SQL_USERNAME } from './secrets.env';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { JwtStrategy } from './modules/authentication/jwt-strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { JwtAuthGuard } from './modules/authentication/jwt-strategies/jwt-guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { FollowersModule } from './modules/followers/followers.module';
import { StyleRendererModule } from './modules/style-renderer/style-renderer.module';

@Module({
  imports: [
    UsersModule,
    RoutesModule,
    AuthenticationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: MY_SQL_USERNAME,
      password: MY_SQL_PASSWORD,
      database: 'hiking_routes',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: './images/',
    }),
    FollowersModule,
    StyleRendererModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: ref => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
    JwtStrategy,
  ],
})
export class AppModule { }
