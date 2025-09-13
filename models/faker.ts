import { IRoles } from "./roles.model";
import { IUser } from "./user.model";

// Utility to generate a fake user with optional overrides
export function getFakeUser(
  overrides: Partial<IUser> = {}
): IUser {
  return {
    _id: "1234567890abcdef",
    email: "fakeuser@example.com",
    name: "John Doe",
    phone: "0233445567",
    profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    role: IRoles.SUDO,
    ...overrides,
  };
}

export const FakeTokens = {
  access_token: "fake-access-token-123456",
  refresh_token: "fake-refresh-token-abcdef",
};
