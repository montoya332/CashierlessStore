import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:admin12345@ds145981.mlab.com:45981/shopez';
//TODO: return Promise
class Client {
    constructor() {
        this.connect();
    }
    connect(done) {
        return MongoClient.connect(
            url,
            (err, client) => {
                this.client = client;
                done && done(err, client);
            }
        );
    }
    getDB(done) {
        this.connect((err, client) => {
            if (err) {
                done(err, client);
            }
            done(err, client, client.db('shopez'));
        });
    }
}
export default new Client();
