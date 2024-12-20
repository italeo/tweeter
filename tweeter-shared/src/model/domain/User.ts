import { UserDto } from "../dto/UserDto";

export class User {
  private _firstName: string;
  private _lastName: string;
  private _alias: string;
  private _imageUrl: string;
  // new varialbe
  private _password: string;

  public constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    password: string
  ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._alias = alias;
    this._imageUrl = imageUrl;
    this._password = password;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public set imageUrl(value: string) {
    this._imageUrl = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public equals(other: User): boolean {
    return this._alias === other._alias;
  }

  public static fromJson(json: string | null | undefined): User | null {
    if (!!json) {
      const jsonObject: {
        _firstName: string;
        _lastName: string;
        _alias: string;
        _imageUrl: string;
        _password: string;
      } = JSON.parse(json);
      return new User(
        jsonObject._firstName,
        jsonObject._lastName,
        jsonObject._alias,
        jsonObject._imageUrl,
        jsonObject._password
      );
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }

  public get dto(): UserDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: this.imageUrl,
    };
  }

  public static fromDto(dto: UserDto | null): User | null {
    console.log("Converting UserDto to User:", dto);

    if (!dto) {
      console.error("Invalid UserDto: DTO is null or undefined");
      return null;
    }

    if (!dto.firstName || !dto.lastName || !dto.alias || !dto.imageUrl) {
      console.error("Missing required fields in UserDto:", dto);
      return null;
    }

    console.log("Valid UserDto fields:", dto);
    return new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl, "");
  }

  public toDto(): UserDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: this.imageUrl,
    };
  }

  public toGetUserDto(): UserDto {
    return {
      firstName: this._firstName,
      lastName: this._lastName,
      alias: this._alias,
      imageUrl: this._imageUrl,
    };
  }
}
