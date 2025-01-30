import { useUser } from "@clerk/nextjs";

class UserService {
  getUserInfo() {
    const { user } = useUser();

    return {
      userFullName: user?.fullName,
      userProfileImageUrl: user?.imageUrl,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId: user?.id,
    };
  }
}

export default new UserService();
