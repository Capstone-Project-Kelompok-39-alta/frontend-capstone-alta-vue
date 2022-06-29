import axios from "axios";
const apiHost = `http://34.229.142.244`;

const state = () => ({
  token: "",
  info: "",
});

const mutations = {
  setToken(state, param) {
    state.token = param;
  },
  setInfo(state, param) {
    state.info = param;
  },
};

const actions = {
  register(store, credentials) {
    const result = axios
      .post(
        `${apiHost}/admin/register`,
        {
          email: credentials.email,
          id_pegawai: credentials.id_pegawai,
          name: credentials.name,
          password: credentials.password,
        }
        // {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Content-type": "application/json",
        //   },
        // }
      )
      .then((response) => {
        console.log("respon: ", response);
        if (response.message === "success register admin") {
          return true;
        } else {
          store.commit("setInfo", response.message);
        }
      })
      .catch((error) => {
        console.log("error nya adalah", error);
        store.commit("setInfo", error);
      });

    return result;
  },
  login(store, credentials) {
    return axios
      .post(`${apiHost}/api/authaccount/login`, {
        email: credentials.email,
        password: credentials.password,
      })
      .then((response) => {
        if (response.data.message === "success") {
          store.commit("setToken", response.data.data.Token);
          store.commit(
            "user/setCurrentUser",
            {
              id: response.data.data.Id,
              username: response.data.data.Name,
              email: response.data.data.Email,
            },
            {
              root: true,
            }
          );
          return response;
        } else {
          store.commit("setInfo", response.data.message);
        }
      })
      .catch((error) => {
        store.commit("setInfo", error);
      });
  },
  logout(store) {
    store.commit("setToken", "");
    store.commit(
      "user/setCurrentUser",
      {
        id: "",
        username: "",
        email: "",
      },
      {
        root: true,
      }
    );
    return true;
  },
  checkUser(store, id) {
    return axios
      .get(`${apiHost}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${store.state.token}` },
      })
      .then((response) => {
        console.warwn("response cekUser", response);
        if (response.data.message === "success") {
          store.commit("setToken", response.data.data.Token);
          store.commit(
            "user/setCurrentUser",
            {
              id: response.data.data.Id,
              username: response.data.data.Name,
              email: response.data.data.Email,
            },
            {
              root: true,
            }
          );
          return response;
        } else {
          store.commit("setInfo", response.data.message);
        }
      })
      .catch((error) => {
        store.commit("setInfo", error);
      });
  },
};

export default {
  state,
  mutations,
  actions,
};