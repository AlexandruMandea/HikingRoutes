import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/app-constants.env';

export const _KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(_KEY, roles);