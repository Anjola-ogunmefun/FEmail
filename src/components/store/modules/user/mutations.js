export default  {
    addUser(state, payload) {
      state.users.push({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        userId: payload.userId,
      });
    },
    findUser(state, payload) {
      state.loggedInUser = payload.email;
    },

    setUsers(state, payload) {
      state.users = payload;
    },
  }