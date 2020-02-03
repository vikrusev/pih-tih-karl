interface IUserModel extends Document {
    name: string,
    lastname: string
}

var schemaObject = {
    name: { type: String },
    lastname: String
};

var UserSchema = new mongoose.Schema(schemaObject, {
    strict: false
});

var Model = mongoose.model('User', UserSchema);

module.exports = Model;