import axios from 'axios';
var baseurl = process.env.BASEURL
export default axios.create({
    baseURL: `${baseurl}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})