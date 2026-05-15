const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const userSchema = new mongoose.Schema({ isOnTeam: Boolean }, { strict: false });
    const User = mongoose.model('User', userSchema);
    
    const result = await User.updateMany({}, { $set: { isOnTeam: true } });
    console.log(`Updated ${result.modifiedCount} users to isOnTeam: true`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
