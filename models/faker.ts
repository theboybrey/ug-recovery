import { IRoles } from "./roles.model";
import { IUser } from "./user.model";

// Utility to generate a fake user with optional overrides
export function getFakeUser(
  overrides: Partial<IUser> = {},
  role?: IRoles
): IUser {
  let name = "John Doe";
  switch (role) {
    case IRoles.SUDO:
      name = "Super Admin";
      break;
    case IRoles.OFFICER:
      name = "Officer Jane";
      break;
    case IRoles.STUDENT:
      name = "Student Mike";
      break;
    default:
      name = "John Doe";
  }
  return {
    _id: "1234567890abcdef",
    email: "fakeuser@example.com",
    name,
    phone: "0233445567",
    profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    role: role || IRoles.OFFICER,
    ...overrides,
  };
}

export const FakeTokens = {
  access_token: "fake-access-token-123456",
  refresh_token: "fake-refresh-token-abcdef",
};
