import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AddUserDTO } from './dto/add-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './models/user-entity';
import { User } from './models/user-interface';
import * as uuid from 'uuid';
import { catchError, from, map, mergeMap, Observable, switchMap } from 'rxjs';
import { RegisterDTO } from './dto/register.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { RoutesService } from '../routes/routes.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => AuthenticationService))
        private authenticationService: AuthenticationService,
        @Inject(forwardRef(() => RoutesService))
        private routesService: RoutesService,
    ) { }

    register(body: RegisterDTO) {
        if (body.password != body.confirmPassword) throw new BadRequestException("Passwords don't match.");

        return this.authenticationService.hashPassword(body.password).pipe(
            switchMap((hashedPassword: string) => {
                const newUser = new UserEntity();
                const id: string = uuid.v4();

                newUser.id = id;
                newUser.name = body.name.trim();
                newUser.email = body.email.trim();
                newUser.password = hashedPassword;

                return from(this.usersRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, salt, ...result } = user;
                        return result;
                    }),
                    catchError((error) => { throw new BadRequestException('Email already used.') })
                )
            })
        )
    }

    login(user: User) {
        return this.validateLogin(user.email, user.password).pipe(
            switchMap((user: User) => {
                return this.authenticationService.generateJWT(user).pipe(map((jwt: string) => jwt));
            }),
            catchError(error => { throw new UnauthorizedException('Wrong Credentials') })
        )
    }

    validateLogin(email: string, password: string): Observable<User> {
        return from(this.usersRepository.findOne({ email })).pipe(
            switchMap((user: User) => this.authenticationService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, salt, ...securedUser } = user;
                        return securedUser;
                    } else {
                        throw new Error();
                    }
                })
            ))
        )
    }

    addUser(body: AddUserDTO) {
        const id: string = uuid.v4();

        const createdUser = { ...body, id };

        return from(this.usersRepository.save(createdUser)).pipe(
            map((user) => {
                const { password, salt, ...securedUser } = user;
                return securedUser;
            })
        );
    }

    getAllUsers() {
        const allUsers = from(this.usersRepository.find())
            .pipe(
                map((users: User[]) => {
                    users.forEach(function (user) {
                        delete user.password;
                        delete user.salt
                    });
                    return users;
                })
            );
        return allUsers;
    }

    getUserByID(id: string, request: Request | undefined) {
        return from(this.usersRepository.findOne({ id: id }, { relations: ['createdRoutes', 'favouriteRoutes', 'travelledRoutes', 'followings', 'followers'] })).pipe(
            map((user: User) => {
                const { password, salt, ...securedUser } = user;
                if (request.user === undefined || id !== request.user['id']) {
                    securedUser.createdRoutes = securedUser.createdRoutes.filter(route => {
                        return !route.isPrivate;
                    });
                    securedUser.favouriteRoutes = securedUser.favouriteRoutes.filter(route => {
                        return !route.isPrivate;
                    });
                    securedUser.travelledRoutes = securedUser.travelledRoutes.filter(route => {
                        return !route.isPrivate;
                    });
                }
                return securedUser;
            })
        );
    }

    getUserByEmail(email: string) {
        email = email.toLowerCase();
        return from(this.usersRepository.findOne({ email: email }, { relations: ['createdRoutes', 'favouriteRoutes', 'travelledRoutes', 'followings', 'followers'] })).pipe(
            map((user) => {
                const { password, salt, ...securedUser } = user;
                return securedUser;
            })
        );
    }

    getUsersByName(name: string) {
        const usersByName = from(this.usersRepository
            .createQueryBuilder('user')
            .select('u')
            .from(UserEntity, 'u')
            .where(`u.name LIKE \'%${name}%\'`)
            .getMany())
            .pipe(
                map((users) => {
                    users.forEach(function (u) {
                        delete u.password;
                        delete u.salt;
                    });
                    return users;
                })
            );
        return usersByName;
    }

    updateUserProfilePicture(request: Request, imgName: string) {
        return from(this.usersRepository.update({ id: request.user['id'] }, { profilePicture: imgName }));
    }

    getUserProfilePicture(userId: string) {
        return from(this.usersRepository.findOne({ id: userId })).pipe(
            map(user => user.profilePicture)
        );
    }

    addRouteToFavourite(request: Request, routeId: string) {
        const route = this.routesService.getRouteById(routeId);

        return route.pipe(
            switchMap(route => {
                return this.routesService.addLikeToRoute(routeId).pipe(
                    switchMap(route => {
                        return this.getUserByID(request.user['id'], request).pipe(
                            switchMap(user => {
                                user.favouriteRoutes.push(route);
                                return from(this.usersRepository.save(user));
                            })
                        )
                    })
                );
            })
        )
    }

    removeRouteFromFavourite(request: Request, routeId: string) {
        const route = this.routesService.getRouteById(routeId);

        return route.pipe(
            switchMap(route => {
                return this.routesService.removeLikeFromRoute(routeId).pipe(
                    switchMap(route => {
                        return this.getUserByID(request.user['id'], request).pipe(
                            switchMap(user => {
                                const index = user.favouriteRoutes.map((r) => { return r.id; }).indexOf(route.id);
                                if (index > -1) user.favouriteRoutes.splice(index, 1);
                                return from(this.usersRepository.save(user));
                            })
                        )
                    })
                );
            })
        )
    }

    addToTravelledRoutes(request: Request, routeId: string) {
        const route = this.routesService.getRouteById(routeId);

        return route.pipe(
            switchMap(route => {
                return this.getUserByID(request.user['id'], request).pipe(
                    switchMap(user => {
                        user.travelledRoutes.push(route);
                        return from(this.usersRepository.save(user));
                    })
                )
            })
        )
    }

    removeFromTravelledRoutes(request: Request, routeId: string) {
        const route = this.routesService.getRouteById(routeId);

        return route.pipe(
            switchMap(route => {
                return this.getUserByID(request.user['id'], request).pipe(
                    switchMap(user => {
                        const index = user.travelledRoutes.map((r) => { return r.id; }).indexOf(route.id);
                        if (index > -1) user.travelledRoutes.splice(index, 1);
                        return from(this.usersRepository.save(user));
                    })
                )
            })
        )
    }

    updateUser(id: string, body: UpdateUserDTO) {
        if (body.password !== '' && body.password !== undefined) {
            return this.authenticationService.hashPassword(body.password).pipe(
                switchMap((hashedPassword: string) => {
                    body.password = hashedPassword;

                    return from(this.usersRepository.update(id, body)).pipe(
                        map((result: UpdateResult) => result),
                        catchError((error) => { throw new BadRequestException('Email already used.') })
                    )
                })
            )
        }

        if (!body.name) delete (body.name);
        if (!body.email) delete (body.email);
        if (!body.password) delete (body.password);

        return from(this.usersRepository.update(id, body));
    }

    getUsersCount() {
        return from(this.usersRepository.count());
    }

    deleteUser(id: string) {
        return from(this.usersRepository.delete(id));
    }
}
