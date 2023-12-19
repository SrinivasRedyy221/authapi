import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
