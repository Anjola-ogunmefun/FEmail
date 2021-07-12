export default {
  namespaced: true,
  state() {
    return {
      users: [],
      loggedInUser: "",
    };
  },
  getters: {
    loggedInUser(state) {
      return state.loggedInUser;
    },
    allUsers(state) {
      return state.users;
    },
  },
  mutations: {
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
  },
  actions: {
    async addUser(context, payload) {
      const userId = context.rootGetters.userId;
      const userData = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      };

      const newUser = await fetch(
        "https://femail-b0318-default-rtdb.firebaseio.com/Users.json",
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );
      const newResponse = await newUser.json();
        console.log({newResponse})

      if (!newUser.ok) {
        const error = new Error(newResponse.message || "Failed to create user");
        throw error;
      }

      context.commit("addUser", {
        firstName: newResponse.firstName,
        lastName: newResponse.lastName,
        email: newResponse.email,
        userId: userId,
      });
    },

    async findUser(context) {
      const token = localStorage.getItem("token");

      const singleUser = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCoXsPMJuHQc004XXQsdE2f0lP1F6JqqBQ`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: token,
          }),
        }
      );

      const user = await singleUser.json();

      if (!singleUser.ok) {
        const error = new Error(user.message || "Failed to fetch user");
        throw error;
      }
      console.log('users', user.users)
      const userEmail = user.users[0].email;
      context.commit("findUser", {
        email: userEmail,
      });
    },

    async loadUsers(context) {
      const response = await fetch(
        `https://femail-b0318-default-rtdb.firebaseio.com/Users.json`
      );
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch!");
        throw error;
      }

      const users = [];

      for (const key in responseData) {
        const user = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          email: responseData[key].email,
        };
        users.push(user);
      }

      context.commit("setUsers", users);
    },

    async sendResetEmail(_, payload) {
      const userEmail = payload.email;
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCoXsPMJuHQc004XXQsdE2f0lP1F6JqqBQ`,
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: userEmail,
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch!");
        throw error;
      }
    },
  },

};
