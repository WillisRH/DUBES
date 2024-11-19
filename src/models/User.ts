// src/models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
    NISN: string;
    name: string;
}

const userSchema: Schema = new Schema({
    nisn: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        unique: true
    }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
