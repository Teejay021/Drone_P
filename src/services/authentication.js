import axios from "axios";

const login = async (authRoute) => {
    try {
        const response = await axios.get(`http://localhost:3002/auth/${authRoute}`);
        return response.data;
    } catch (error) {
        console.error(`Request failed for ${authRoute}`, error);
        return null;
    }
}

export const loginWithGoogle = () => login('google');
export const loginWithFacebook = () => login('facebook');
export const loginWithGithub = () => login('github');
