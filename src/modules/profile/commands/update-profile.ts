import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UpdateProfileReqDto, CreateProfileResponseDto } from '../dto';
import { ProfileService } from '../profile.service';

export class UpdateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateProfileReqDto,
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(private readonly profileService: ProfileService) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<CreateProfileResponseDto> {
    const { id, data } = command;
    const profile = await this.profileService.getProfile(id);

    if (!profile || profile.userId !== data.userId) {
      throw new HttpException('Profile not found.', HttpStatus.BAD_REQUEST);
    }
    return this.profileService.updateProfile(id, data);
  }
}
