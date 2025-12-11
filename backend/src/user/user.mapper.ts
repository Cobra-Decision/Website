import { Prisma, User } from 'src/prisma/generated/client';
import { UserResponseDto } from './dto/user-response.dto';
import { UserCreateDto } from './dto';

export const UserMapper = {
  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updateAt: user.updatedAt,
    };
  },

  toCreateEntity(dto: UserCreateDto): Prisma.UserCreateInput {
    return {
      email: dto.email,
      password: dto.password,
      lastName: null,
      firstName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  },
};
