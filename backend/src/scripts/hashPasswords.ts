import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';

/**
 * Script to hash all plain text passwords in the database
 * Run with: npx ts-node src/scripts/hashPasswords.ts
 */

async function hashAllPasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/diplomski');
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.lozinka.startsWith('$2a$') || user.lozinka.startsWith('$2b$')) {
        console.log(`⏭️  Skipping ${user.kor_ime} - already hashed`);
        skippedCount++;
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.lozinka, 10);
      
      // Update user
      user.lozinka = hashedPassword;
      await user.save();
      
      console.log(`✅ Hashed password for: ${user.kor_ime}`);
      updatedCount++;
    }

    console.log('\n📈 Summary:');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${users.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Done! Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

hashAllPasswords();
