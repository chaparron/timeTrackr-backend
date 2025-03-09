import { UserResponseDto } from "@application/dto/users/user-response.dto";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GetUserDetailsUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) { }
    async execute(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true,
        })
    }

}