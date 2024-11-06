import {
  AuthToken,
  AuthTokenDto,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  StatusDto,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private static instance: ServerFacade;
  private SERVER_URL =
    "https://hhx5pg1c5c.execute-api.us-west-2.amazonaws.com/dev";
  private clientCommunicator: ClientCommunicator;

  private constructor() {
    this.clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  }

  // Singleton access method
  public static getInstance(): ServerFacade {
    if (!ServerFacade.instance) {
      ServerFacade.instance = new ServerFacade();
    }
    return ServerFacade.instance;
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getIsFollowerStatus(
    authToken: string,
    userId: string,
    selectedUserId: string
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<any, any>(
      { authToken, userId, selectedUserId },
      "/follower/status"
    );

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getFolloweeCount(
    authToken: string,
    userId: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<any, any>(
      { authToken, userId },
      "/followee/count"
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getFollowerCount(
    authToken: string,
    userId: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<any, any>(
      { authToken, userId },
      "/follower/count"
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async follow(
    authToken: string,
    userToFollowId: string
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<any, any>(
      { authToken, userToFollowId },
      "/follow"
    );

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async unfollow(
    authToken: string,
    userToUnfollowId: string
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<any, any>(
      { authToken, userToUnfollowId },
      "/unfollow"
    );

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }

  public async register(
    request: Omit<RegisterRequest, "token">
  ): Promise<[User, AuthToken]> {
    const fullRequest: RegisterRequest = {
      ...request,
      token: "dummy_token_for_registration",
    };

    try {
      const response = await this.clientCommunicator.doPost<
        RegisterRequest,
        RegisterResponse
      >(fullRequest, "/register");

      if (response.success) {
        const user = User.fromDto(response.user as UserDto);
        const authToken = AuthToken.fromDto(response.authToken as AuthTokenDto);
        return [user as User, authToken as AuthToken];
      } else {
        console.error("Register failed:", response);
        throw new Error(
          response.message || "An error occurred during registration"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Client communicator POST failed:", error.message);
        throw new Error("Client communicator POST failed: " + error.message);
      } else {
        console.error(
          "Client communicator POST failed with unknown error:",
          error
        );
        throw new Error("Client communicator POST failed with unknown error");
      }
    }
  }

  public async login(
    request: Omit<LoginRequest, "token">
  ): Promise<[User, AuthToken]> {
    const fullRequest: LoginRequest = {
      ...request,
      token: "dummy_token_for_login",
    };

    try {
      const response = await this.clientCommunicator.doPost<
        LoginRequest,
        LoginResponse
      >(fullRequest, "/login");

      if (response.success) {
        const user = User.fromDto(response.user as UserDto);
        const authToken = AuthToken.fromDto(response.authToken as AuthTokenDto);
        return [user as User, authToken as AuthToken];
      } else {
        console.error("Login failed:", response);
        throw new Error(response.message || "An error occurred during login");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Client communicator POST failed:", error.message);
        throw new Error("Client communicator POST failed: " + error.message);
      } else {
        console.error(
          "Client communicator POST failed with unknown error:",
          error
        );
        throw new Error("Client communicator POST failed with unknown error");
      }
    }
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };

    try {
      const response = await this.clientCommunicator.doPost<
        LogoutRequest,
        LogoutResponse
      >(request, "/logout");

      if (!response.success) {
        console.error("Logout failed:", response);
        throw new Error(response.message || "An error occurred during logout");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Client communicator POST failed:", error.message);
        throw new Error("Client communicator POST failed: " + error.message);
      } else {
        console.error(
          "Client communicator POST failed with unknown error:",
          error
        );
        throw new Error("Client communicator POST failed with unknown error");
      }
    }
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };

    try {
      const response = await this.clientCommunicator.doPost<
        GetUserRequest,
        GetUserResponse
      >(request, "/user");

      if (response.success) {
        return response.user ? User.fromDto(response.user as UserDto) : null;
      } else {
        console.error("GetUser failed:", response);
        throw new Error(
          response.message || "An error occurred while fetching user data"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Client communicator POST failed:", error.message);
        throw new Error("Client communicator POST failed: " + error.message);
      } else {
        console.error(
          "Client communicator POST failed with unknown error:",
          error
        );
        throw new Error("Client communicator POST failed with unknown error");
      }
    }
  }

  public async postStatus(token: string, status: StatusDto): Promise<void> {
    const request: PostStatusRequest = {
      token: token,
      status: status,
    };

    try {
      const response = await this.clientCommunicator.doPost<
        PostStatusRequest,
        PostStatusResponse
      >(request, "/poststatus");

      if (!response.success) {
        console.error("PostStatus failed:", response);
        throw new Error(
          response.message || "An error occurred while posting the status"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Client communicator POST failed:", error.message);
        throw new Error("Client communicator POST failed: " + error.message);
      } else {
        console.error(
          "Client communicator POST failed with unknown error:",
          error
        );
        throw new Error("Client communicator POST failed with unknown error");
      }
    }
  }
}