import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserBOWebServiceComponent} from "./user.component";

@Module({
    imports: [],
    controllers: [UserController],
    components: [UserBOWebServiceComponent]
})
export class UserModule {}
