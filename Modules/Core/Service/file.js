const fs = require('fs')
const userFiles ='uploads'
var url = ''

class File{

    constructor(){
         
    }

    static Image(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {            
            return this.upload_file(file,dest,name,extension)
        }
        return ''
    }

    static generalFile(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {
            console.log(file)
            let check = this.isBase64(file)
            if(check == false){
                console.log(file)
                let data = this.Base64_encode(file.path)
                return this.upload_file(data,dest,name,extension)
            }else{
                return this.upload_file(file,dest,name,extension)
            }
        }
        return ''
    }

    static zipFile(file,name,extension) {

    }

    static isBase64(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }

    static upload_file(file,dest,name,extension = ''){
        var image = file.replace(/^data:.*,/, '')
        image = image.replace(/ /g, '+')
        var bitmap = new Buffer(image, 'base64')
        url = userFiles+ dest+ name +'-'+ Date.now() + extension
        fs.writeFileSync(url, bitmap)
        return url
    }

    static Base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file)
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64')
    }
    
}

module.exports = File