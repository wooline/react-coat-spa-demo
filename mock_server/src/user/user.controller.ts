import {Get, Post, Put, Delete, Controller, Query, Body, Param} from "@nestjs/common";
import {UserBOWebServiceComponent} from "./user.component";

@Controller("/ajax/user")
export class UserController {
    constructor(private readonly userBOWebServiceComponent: UserBOWebServiceComponent) {}

    @Get("/getRandomPassword")
    async getRandomPassword() {
        return this.userBOWebServiceComponent.getRandomPassword();
    }
    @Get()
    async getList(@Query() query) {
        return this.userBOWebServiceComponent.getList(query);
    }
    @Get("/:id")
    async get(@Param() param: {id: string}) {
        return this.userBOWebServiceComponent.get(param.id);
    }
    @Post()
    async create(@Body() body) {
        return this.userBOWebServiceComponent.create(body);
    }
    @Put("/:id")
    async update(@Param() param: {id: string}, @Body() body) {
        return this.userBOWebServiceComponent.update(param.id, body);
    }
    @Delete("/:id")
    async delete(@Param() param: {id: string}) {
        return this.userBOWebServiceComponent.delete(param.id);
    }
    @Put("/:id/disable")
    async disable(@Param() param: {id: string}) {
        return this.userBOWebServiceComponent.disable(param.id);
    }
    @Put("/:id/enable")
    async enable(@Param() param: {id: string}) {
        return this.userBOWebServiceComponent.enable(param.id);
    }
    @Put("/:id/password")
    async updatePasswordById(@Param() param: {id: string}) {
        return this.userBOWebServiceComponent.updatePasswordById(param.id);
    }
}
