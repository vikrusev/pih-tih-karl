let UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: Date, // Date of last successful login
    profile: String
}, {
    strict: false
});

UserSchema.pre("save", function (next) {
    let now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    next();
  });
  UserSchema.methods.fullName = function(): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
  };

var Model = mongoose.model('User', UserSchema);

module.exports = Model;