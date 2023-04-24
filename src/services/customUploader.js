import axios from "axios";

class CustomUploader {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        const data = new FormData()
        data.append('file', await this.loader.file)

        const res = await axios.post('uploadFile', data, {
            'Content-Type': 'multipart/form-data'
        })

        return {
            default: res.data
        }
    }
}

export default CustomUploader;