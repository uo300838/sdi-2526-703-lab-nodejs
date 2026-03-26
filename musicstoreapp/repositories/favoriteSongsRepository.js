module.exports = {
    dbClient: null,
    app: null,
    database: "musicStore",
    collectionName: "favorite_songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getFavorites: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoritesCollection = database.collection(this.collectionName);
            return await favoritesCollection.find(filter, options).toArray();
        } catch (error) {
            throw error;
        }
    },
    insertFavorite: async function (favorite) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoritesCollection = database.collection(this.collectionName);
            const result = await favoritesCollection.insertOne(favorite);
            return result.insertedId;
        } catch (error) {
            throw error;
        }
    },
    deleteFavorite: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const favoritesCollection = database.collection(this.collectionName);
            return await favoritesCollection.deleteOne(filter, options);
        } catch (error) {
            throw error;
        }
    }
};
