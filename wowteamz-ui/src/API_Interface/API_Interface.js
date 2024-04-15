import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    axios.defaults.baseURL = `http://localhost:8443/api/v1`;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


//    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

export default class APIInterface {

    //Login

    async getUserInfo(email, password) {
        console.log(JSON.stringify(email));
        console.log(JSON.stringify(password));
        return axiosAgent.post(`/login/`, {email, password});
    }

    //Signup

    async checkUserEmail(email) {
        return axiosAgent.get(`/signup/${email}`);
    }

    async insertNewUser(userName, email, password) {
        console.log(JSON.stringify(email));
        console.log(JSON.stringify(password));
        return axiosAgent.post(`/signup/`, {email, password, userName});
    }

    //Characters

    async insertCharacter(userName) {
        return axiosAgent.post(`/characters/insert`, { userName })
            .then(response => response.data)
            .catch(error => ({
                error,
                character: undefined
            }));
    }
    async allCharacters() {
        return axiosAgent.get(`characters/all-characters`);

    }

    async deleteCharacter(characterName) {
        return axios.delete(`/characters/delete/${encodeURIComponent(characterName)}`);
    }

    //Accounts

    async allAccounts() {
        return axiosAgent.get(`accounts/all-accounts`);
    }

    async accountWithEmail(email) {
        return axiosAgent.get(`accounts/${email}`);
    }


    //Raid Teams

    async allRaidTeams() {
        return axiosAgent.get(`raidteams/all-raidteams`);
    }

    async addPlayerToRaid(raidteam_id, character_id) {
        return axiosAgent.get(`raidteams/${raidteam_id}/${character_id}`);
    }

}