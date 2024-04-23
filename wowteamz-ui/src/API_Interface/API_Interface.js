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

    async insertCharacter(userName, raidTeam_id) {
        return axiosAgent.post(`/characters/insert/`, { userName, raidTeam_id })
            .then(response => response.data)
            .catch(error => ({
                error,
                character: undefined
            }));
    }
    async allCharacters(raidTeam_id) {
        return axiosAgent.get(`characters/all-characters/${raidTeam_id}`);

    }

    async deleteCharacter(characterName) {
        return axios.delete(`/characters/delete/${encodeURIComponent(characterName)}`);
    }
    
    async insertNotes(characterName, notes) {
        return axios.post(`/characters/insert-notes/${encodeURIComponent(characterName)}`, { notes });
    }
    async insertRole(characterName, raidTeam_id, role) {
        return axios.post(`/characters/insert-role/${encodeURIComponent(characterName)}/${raidTeam_id}`, { role })  // Ensure correct URL and data
            .then(response => response.data)
            .catch(error => ({
                error,
            }));
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

    async checkRaidName(teamName) {
        return axiosAgent.get(`/raidteams/${teamName}`);
    }

    async createRaidTeam(teamName, numPlayers, raidDay_A, raidDay_B, raidTime) {
        return axiosAgent.post(`/raidteams/`, {teamName, numPlayers, raidDay_A, raidDay_B, raidTime});
    }

    async addPlayerToRaid(raidTeam_id, character_id) {
        return axiosAgent.get(`raidteams/${raidTeam_id}/${character_id}`);
    }

    async charsForRaidTeam(raidTeam_id) {
        return axiosAgent.get(`/raidteams/${raidTeam_id}/chars-for-raidteam`);
    }

    async removeChar(character_id) {
        return axios.patch(`/raidteams/remove/${character_id}`);
    }

    async deleteRaid(raidTeam_id) {
        return axios.delete(`/raidteams/delete/${raidTeam_id}`);
    }

}