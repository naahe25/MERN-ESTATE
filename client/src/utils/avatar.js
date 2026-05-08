export const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e2e8f0'/%3E%3Ccircle cx='100' cy='78' r='38' fill='%2394a3b8'/%3E%3Cpath d='M35 180c8-42 36-65 65-65s57 23 65 65' fill='%2394a3b8'/%3E%3C/svg%3E";

export const getAvatarUrl = (user, overrideUrl) => {
    const avatar = overrideUrl || user?.photo || user?.avatar;

    if (!avatar || avatar === DEFAULT_AVATAR) {
        return DEFAULT_AVATAR;
    }

    return avatar;
};
