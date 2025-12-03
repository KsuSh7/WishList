export function useAuth() {
  return {
    user: { id: 1, username: 'TestUser', avatar: null },
    updateUser: () => {},
    loading: false,
  }
}