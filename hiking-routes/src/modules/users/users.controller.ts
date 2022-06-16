import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AddUserDTO } from './dto/add-user.dto';
import { User } from './models/user-interface';
import { UserRole } from 'src/app-constants.env';
import { Roles } from '../authentication/roles/roles-decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authentication/roles/roles-guard';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from './helpers/image-upload-helper';
import { diskStorage } from 'multer';
import { UpdateResult } from 'typeorm';
import { AllowAny } from '../authentication/decorators/allow-any-decorator';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    @AllowAny()
    @UsePipes(ValidationPipe)
    async register(@Body() body: RegisterDTO) {
        return this.usersService.register(body).pipe(
            tap((user: User) => user),
            catchError(error => throwError(() => error))
        );
    }

    @Post('login')
    @AllowAny()
    @UsePipes(ValidationPipe)
    async login(@Body() body: LoginDTO) {
        return this.usersService.login(body).pipe(
            map((jwt: string) => {
                return { accessToken: jwt };
            }),
            catchError(error => throwError(() => error))
        )
    }

    @Post('/add')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UsePipes(ValidationPipe)
    addUser(@Body() body: AddUserDTO, @Req() request: Request) {
        return this.usersService.addUser(body).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('/get-all')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    getAllUsers(@Req() request: Request) {
        return this.usersService.getAllUsers().pipe(
            tap((users: User[]) => users),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('/get-all-users-paginated')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    getAllRoutesPaginated(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        limit = limit < 0 ? 10 : limit;
        page = page < 1 ? 1 : page;

        return this.usersService.getAllUsersPaginated({ page, limit, route: 'http://localhost:3000/hiking-routes/users/get-all-users-paginated' });
    }

    @Get('/get/name=:name')
    @AllowAny()
    getUsersByName(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Param('name') name: string): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        limit = limit < 0 ? 10 : limit;
        page = page < 1 ? 1 : page;

        return this.usersService.getUsersByName({ page, limit, route: `http://localhost:3000/hiking-routes/users/get/name=${name}` }, name);
    }

    @Get('/get/id=:id')
    @AllowAny()
    getUserByID(@Param('id') id: string, @Req() request: Request) {
        return this.usersService.getUserByID(id, request).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('/get/email=:email')
    @AllowAny()
    getUsersByEmail(@Param('email') email: string, @Req() request: Request) {
        return this.usersService.getUserByEmail(email).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('upload-profile-picture')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './images/profile_pictures',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };

        return this.usersService.updateUserProfilePicture(request, response.filename).pipe(
            tap((updateResult: UpdateResult) => updateResult),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('get/profile-picture/:imgName')
    @AllowAny()
    getProfilePicture(@Param('imgName') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: './images/profile_pictures' });
    }

    @Post('/add-route-to-favourites/routeId=:routeId')
    @UseGuards(AuthGuard('jwt'))
    addRouteToFavourite(@Param('routeId') routeId: string, @Req() request: Request) {
        return this.usersService.addRouteToFavourite(request, routeId).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('remove-from-favourites/routeId=:routeId')
    @UseGuards(AuthGuard('jwt'))
    removeRouteFromFavourite(@Param('routeId') routeId: string, @Req() request: Request) {
        return this.usersService.removeRouteFromFavourite(request, routeId).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('/add-to-travelled/routeId=:routeId')
    @UseGuards(AuthGuard('jwt'))
    addToTravelledRoutes(@Param('routeId') routeId: string, @Req() request: Request) {
        return this.usersService.addToTravelledRoutes(request, routeId).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('remove-from-travelled/routeId=:routeId')
    @UseGuards(AuthGuard('jwt'))
    removeFromTravelledRoutes(@Param('routeId') routeId: string, @Req() request: Request) {
        return this.usersService.removeFromTravelledRoutes(request, routeId).pipe(
            tap((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Put('/update/id=:id')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO, @Req() request: Request) {
        return this.usersService.updateUser(id, body).pipe(
            tap((updateResult) => updateResult),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get('/get/users-count')
    @AllowAny()
    getUsersCount() {
        return this.usersService.getUsersCount().pipe(
            tap((count: number) => count),
            catchError(err => of({ error: err.message }))
        );
    }

    @Delete('delete/id=:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    deleteUser(@Param('id') id: string, @Req() request: Request) {
        return this.usersService.deleteUser(id).pipe(
            tap((deleteResult) => deleteResult),
            catchError(err => of({ error: err.message }))
        );
    }
}
