import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "register", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  deleteUserAndPosts(userId) {
    console.log("balls")
    return axios.delete(API_URL + `delete/${userId}`).then((response) => {
      // Assuming your server returns some confirmation message
      return response.data;
    });
  }
}

export default new AuthService();
