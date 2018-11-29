import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:admin12345@ds145981.mlab.com:45981/shopez';
//TODO: return Promise
class Client {
    constructor() {
        this.client = this.getClient();
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
    get() {
        if (this.client) {
            this.connect();
        }
        return this;
    }
    getClient() {
        if (this.client) {
            this.connect();
        }
        return this.client;
    }
    getDB() {
        const client = this.get();
        if (!client) {
            console.log('Error ');
            return {};
        }
        const db = client.db('shopez');
        return db;
    }
}
export default new Client();
