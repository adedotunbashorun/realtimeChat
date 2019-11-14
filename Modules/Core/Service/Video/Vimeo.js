const config = require('../../../../config/index');
const Vimeo = require('vimeo').Vimeo;

class Vimeo {
    constructor(){
        this.client = new Vimeo(config.video.vimeo.clientId, config.video.vimeo.clientSecret, config.video.vimeo.accessToken);
    }

    async upload(file_path, name, desc = ""){
        await this.client.upload(file_path,{'name': name,'description': desc}, function (uri) {
                    console.log('Your video URI is: ' + uri);
                },function (bytes_uploaded, bytes_total) {
                    var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
                    console.log(bytes_uploaded, bytes_total, percentage + '%')
                },function (error) {
                    console.log('Failed because: ' + error)
                });
    }

    async checkTransCodeStatus(){
        await this.client.request(uri + '?fields=transcode.status', function (error, body, status_code, headers) {
                if (body.transcode.status === 'complete') {
                console.log('Your video finished transcoding.')
                } else if (body.transcode.status === 'in_progress') {
                console.log('Your video is still transcoding.')
                } else {
                console.log('Your video encountered an error during transcoding.')
                }
            });
    }
}

module.exports = Vimeo