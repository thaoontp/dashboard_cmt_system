import { createStore } from 'vuex';
import axios from '../api/axiosClient';


const store = createStore({
  state: {
    isLoggedIn: false,
    userInfo: null,
  },
  mutations: {
    SET_LOGIN_STATE(state, userInfo) {
      state.isLoggedIn = true;
      state.userInfo = userInfo;
    },
    LOGOUT(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post("/user/loginUser", {
          USERNAME: credentials.username,
          PASSWORD: credentials.password,
        });
        if (response.status >= 200 && response.status <= 300) {
          const user = response.data.message;
          console.log(user);
          const token = response.data.metadata;
          if (user.ROLE.IS_ADMIN) {
            localStorage.setItem("token", token);
            commit('SET_LOGIN_STATE', user);
            return true;
          } else {
            alert("Bạn không có quyền truy cập với tài khoản này.");
            return false;
          }
        }
      } catch (error) {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập." + error.toString());
        return false;
      }
    },
    async getUserInfo({ commit }) {
      try {
        const response = await axios.get("/user/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.status >= 200 && response.status <= 300) {
          const userInfo = response.data;
          commit('SET_LOGIN_STATE', userInfo); 
        }
      } catch (error) {
        console.error("Error while getting user info:", error);
      }
    },
    logout({ commit }) {
      console.log("Token before removal:", localStorage.getItem("token"));
      localStorage.removeItem("token");
      commit('LOGOUT');
      console.log("Token after removal:", localStorage.getItem("token"));
    }
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    userInfo: (state) => state.userInfo // Sửa tên getter thành userInfo để khớp với state
  }
});

export default store;
