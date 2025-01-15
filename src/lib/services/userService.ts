import { useUser } from "@clerk/nextjs";

class UserService {
  getUserInfo() {
    const { user } = useUser();

    return {
      userFullName: user?.fullName,
      userProfileImageUrl: user?.imageUrl,
      username: user?.username,
    };
  }
}

export default new UserService();
