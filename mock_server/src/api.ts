export namespace app.api.user {
    export interface GetUserListRequest {
        username?: string;
        roleId?: string;
        createdTimeEnd?: Date;
        createdTimeStart?: Date;
        pageSize?: number;
        pageIndex?: number;
    }
    export interface GetUserListResponse {
        userList?: app.api.user.UserDetailResponse[];
        totalCount?: number;
        totalPage?: number;
        success?: boolean;
        error?: app.api.user.GetUserListResponse$ResponseError;
    }
    export interface UserDetailResponse {
        userId: string;
        username: string;
        state: number;
        roleType: number;
        roleId: string;
        roleName: string;
        roleDes?: string;
        createdTime?: Date;
        updateTime?: Date;
    }
    export interface CreateUserRequest {
        username: string;
        roleId: string;
        requestedBy: string;
    }
    export interface CreateUserResponse {
        success?: boolean;
        userId?: string;
        password?: string;
        errorCode?: app.api.user.CreateUserResponse$ErrorCode;
    }
    export interface UpdateUserRequest {
        roleId: string;
    }
    export interface UpdateUserResponse {
        success?: boolean;
        error?: app.api.user.UpdateUserResponse$ResponseError;
    }
    export interface UpdatePasswordByIdResponse {
        success?: boolean;
        password: string;
        error?: app.api.user.UpdatePasswordByIdResponse$ResponseError;
    }
    export interface RandomPasswordResponse {
        success?: boolean;
        password: string;
    }
    export interface GetCurrentUserResponse {
        loggedIn?: boolean;
        username?: string;
    }
    export enum GetUserListResponse$ResponseError {
        CREATEDTIMEFAIT
    }
    export enum CreateUserResponse$ErrorCode {
        USERNAME_EXIST
    }
    export enum UpdateUserResponse$ResponseError {
        USER_NOEXIST,
        ADMINISTRATOR
    }
    export enum UpdatePasswordByIdResponse$ResponseError {
        USER_NOEXIST
    }
}
export namespace app.backoffice.api {
    export const UserBOWebServiceMetadata = {
        getList: {method: "GET", path: "/ajax/user"},
        create: {method: "POST", path: "/ajax/user"},
        get: {method: "GET", path: "/ajax/user/:userId"},
        update: {method: "PUT", path: "/ajax/user/:userId"},
        delete: {method: "DELETE", path: "/ajax/user/:userId"},
        disable: {method: "PUT", path: "/ajax/user/:userId/disable"},
        enable: {method: "PUT", path: "/ajax/user/:userId/enable"},
        updatePasswordById: {method: "PUT", path: "/ajax/user/:userId/password"},
        getRandomPassword: {method: "GET", path: "/ajax/user/getRandomPassword"}
    };
    export interface UserBOWebService {
        getList(request: app.api.user.GetUserListRequest): Promise<app.api.user.GetUserListResponse>;
        create(request: app.api.user.CreateUserRequest): Promise<app.api.user.CreateUserResponse>;
        get(userId: string): Promise<app.api.user.UserDetailResponse>;
        update(userId: string, request: app.api.user.UpdateUserRequest): Promise<app.api.user.UpdateUserResponse>;
        delete(userId: string): Promise<app.api.user.UpdateUserResponse>;
        disable(userId: string): Promise<app.api.user.UpdateUserResponse>;
        enable(userId: string): Promise<app.api.user.UpdateUserResponse>;
        updatePasswordById(userId: string): Promise<app.api.user.UpdatePasswordByIdResponse>;
        getRandomPassword(): Promise<app.api.user.RandomPasswordResponse>;
    }
    export const AccountBOWebServiceMetadata = {
        currentUser: {method: "GET", path: "/ajax/currentUser"},
        login: {method: "PUT", path: "/ajax/login"},
        logout: {method: "PUT", path: "/ajax/logout"}
    };
    export interface AccountBOWebService {
        currentUser(): Promise<app.api.user.GetCurrentUserResponse>;
        login(request: app.backoffice.api.user.LoginRequest): Promise<app.backoffice.api.user.LoginResponse>;
        logout(): Promise<void>;
    }
    export const UserPermissionBOWebServiceMetadata = {
        getCurrentUserPermissions: {method: "GET", path: "/ajax/currentUser/permissions"}
    };
    export interface UserPermissionBOWebService {
        getCurrentUserPermissions(): Promise<app.backoffice.api.operation.CurrentUserPermissionResponse>;
    }
    export const PermissionBOWebServiceMetadata = {
        getAll: {method: "GET", path: "/ajax/permissions"}
    };
    export interface PermissionBOWebService {
        getAll(): Promise<app.backoffice.api.user.PermissionView[]>;
    }
}
export namespace app.backoffice.api.user {
    export interface LoginRequest {
        username: string;
        password: string;
    }
    export interface LoginResponse {
        success?: boolean;
        username?: string;
        errorMessage?: string;
    }
    export interface PermissionView {
        name?: string;
        id?: string;
    }
}
export namespace app.backoffice.api.operation {
    export interface CurrentUserPermissionResponse {
        permissions?: string[];
    }
}
