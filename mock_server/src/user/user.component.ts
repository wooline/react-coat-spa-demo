import {Component} from "@nestjs/common";
import {app} from "../api";
import UserBOWebService = app.backoffice.api.UserBOWebService;
import UserBOWebServiceMetadata = app.backoffice.api.UserBOWebServiceMetadata;

const List = [
    {
        userId: "111",
        username: "jimmy",
        state: 1,
        roleType: 2,
        roleId: "0",
        roleName: "admin"
    },
    {
        userId: "222",
        username: "jimmy",
        state: 1,
        roleType: 2,
        roleId: "0",
        roleName: "admin"
    }
];

@Component()
export class UserBOWebServiceComponent implements UserBOWebService {
    getList(request: app.api.user.GetUserListRequest): Promise<app.api.user.GetUserListResponse> {
        return Promise.resolve({
            userList: List,
            totalCount: List.length,
            totalPage: 1,
            success: true
        });
    }
    create(request: app.api.user.CreateUserRequest): Promise<app.api.user.CreateUserResponse> {
        return Promise.resolve({});
    }
    get(userId: string): Promise<app.api.user.UserDetailResponse> {
        return Promise.resolve({
            userId: "111",
            username: "jimmy",
            state: 1,
            roleType: 2,
            roleId: "0",
            roleName: "admin"
        });
    }
    update(userId: string, request: app.api.user.UpdateUserRequest): Promise<app.api.user.UpdateUserResponse> {
        return Promise.resolve({});
    }
    delete(userId: string): Promise<app.api.user.UpdateUserResponse> {
        return Promise.resolve({});
    }
    disable(userId: string): Promise<app.api.user.UpdateUserResponse> {
        return Promise.resolve({});
    }
    enable(userId: string): Promise<app.api.user.UpdateUserResponse> {
        return Promise.resolve({});
    }
    updatePasswordById(userId: string): Promise<app.api.user.UpdatePasswordByIdResponse> {
        return Promise.resolve({password: "afdsfds"});
    }
    getRandomPassword(): Promise<app.api.user.RandomPasswordResponse> {
        return Promise.resolve({password: "afdsfds"});
    }
}
