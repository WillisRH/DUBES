const { default: axios } = require("axios");

export const getUserData = async (param: any) => {
    try {
        const res = await axios.get('/api/admin/me');
        const userData = res.data.data;
        // console.log("User Data:", userData);

        // Check if the requested parameter exists in the user data
        if (param in userData) {
            console.log(`${param}:`, userData[param]);
            return userData[param];
        } else {
            // console.error(`Parameter "${param}" does not exist in user data.`);
            return null; // Return null if the parameter doesn't exist
        }
    } catch (error: any) {
        // console.error(`Failed to get user data for parameter "${param}":`, error.message);
        return null; // Return null if there's an error
    }
};
 