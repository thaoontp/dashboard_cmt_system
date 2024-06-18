import { createStore } from 'vuex';
import axios from '../api/axiosClient';
import { message } from 'ant-design-vue';

const store = createStore({
  state: {
    isLoggedIn: false,
    userInfo: null,
    packages: [],
    users: [],
  },
  mutations: {
    SET_LOGIN_STATE(state, userInfo) {
      state.isLoggedIn = true;
      state.userInfo = userInfo;
    },
    LOGOUT(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    // Cập nhật danh sách các gói trong state
    SET_PACKAGES(state, packages) {
      state.packages = packages;
    },
    UPDATE_PACKAGE(state, updatedPackage) {
      // Cập nhật gói trong state
      const index = state.packages.findIndex(pkg => pkg._id === updatedPackage._id);
      if (index !== -1) {
        state.packages[index] = updatedPackage;
      }
    },
    DELETE_PACKAGE(state, packageId) {
      state.packages = state.packages.filter(pkg => pkg._id !== packageId);
    },
    blockUser(state, userId) {
      const user = state.users.find(user => user.id === userId);
      if (user) {
        user.isBlocked = true; 
      }
    },
  },
  actions: {

    async fetchPackages({ commit }) {
      try {
        const response = await axios.get('/package/getData');
        if (response.data.success) {
          commit('SET_PACKAGES', response.data.data);
        } else {
          throw new Error('Failed to fetch packages');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
      }
    },
    async updatePackage({ commit }, updatedPackage) {
      try {
        const { _id, ...updatedData } = updatedPackage;
    
        const response = await axios.put(`/package/update/${_id}`, updatedData);
        if (response.status === 200) {
          commit('UPDATE_PACKAGE', updatedPackage);
          message.success('Cập nhật gói thàng công!');
        } else {
          throw new Error('Update package failed');
        }
      } catch (error) {
        console.error('Error updating package:', error);
        throw error;
      }
    },
    async deletePackage({ commit }, packageId) {
      try {
        const response = await axios.delete(`/package/delete/${packageId}`);
        if (response.status === 200) {
          commit('DELETE_PACKAGE', packageId);
          message.success('Đã xóa gói thành công!');
        } else {
          // Xử lý trường hợp server trả về mã lỗi khác với 200
          const errorMessage = response.data.message || 'Delete package failed';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        message.error('Lỗi khi xóa gói: ' + error.message);
        throw error;
      }
    },
    async blockUser({ commit }, userId) {
      try {
        const response = await axios.post(`/user/blockUser`, { 
          userId: userId,
          IS_BLOCKED: true
        });
        console.log(response)
        if (response.status === 200) {
          commit('blockUser', userId); 
          message.success('User has been blocked successfully');
        } else {
          throw new Error('Failed to block user: ' + response.statusText);
        }
      } catch (error) {
        console.error('Error blocking user:', error);
        message.error('Error blocking user');
      }
    },

    async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post("/user/loginUser", {
          USERNAME: credentials.username,
          PASSWORD: credentials.password,
        });
        if (response.status >= 200 && response.status <= 300) {
          const user = response.data.message;
          const token = response.data.metadata;
          if (user.ROLE.IS_ADMIN) {
            localStorage.setItem("token", token);
            commit('SET_LOGIN_STATE', user);
            dispatch('getUserInfo');
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
        console.log("Starting getUserInfo action");
        const response = await axios.get("/user/info");
        console.log("API response:", response);
        if (response.status >= 200 && response.status < 300) {
          const userInfo = response.data;
          console.log("User info:", userInfo);
          commit('SET_LOGIN_STATE', userInfo);
          
        } else {
          console.error("Unexpected response status:", response.status);
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
    },
    async checkToken ({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/user/info");
          if (response.status >= 200 && response.status < 300) {
            const userInfo = response.data;
            commit('SET_LOGIN_STATE', userInfo);
          } else {
            console.error("Unexpected response status:", response.status);
            dispatch('logout');
          }
        } catch (error) {
          console.error("Error while getting token:", error);
          dispatch('logout');
        }
      } else {
        console.log("No token found in localStorege.")
      }
    }
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    userInfo: (state) => state.userInfo,
    packages: (state) => state.packages,
  }
});

store.dispatch('checkToken');

export default store;
