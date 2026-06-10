import type { UserRole } from './enums';

export type PermissionRole = UserRole;

export type RoutePermission = {
  requiresAuth?: boolean;
  roles?: PermissionRole[];
};
