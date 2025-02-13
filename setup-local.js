const { execSync } = require('child_process');

const MONGO_CONTAINER = 'librechat-mongo';
const LOCAL_EMAIL = 'parser@user.com';
const LOCAL_PASSWORD = 'testpass';
const LOCAL_NAME = 'Local User';
const LOCAL_USERNAME = 'parser';

function isMongoRunning() {
  try {
    execSync(`docker ps --filter "name=${MONGO_CONTAINER}" --format "{{.Names}}"`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function startMongoDB() {
  console.log('🚀 Starting MongoDB in Docker...');
  execSync(`docker run -d -p 27017:27017 --name ${MONGO_CONTAINER} mongo`, { stdio: 'inherit' });
  console.log('✅ MongoDB started successfully!');
}

function userExists() {
  try {
    const command = `
      docker exec ${MONGO_CONTAINER} mongosh --quiet --eval '
      db = db.getSiblingDB("LibreChat");
      printjson(db.users.findOne({ email: "${LOCAL_EMAIL}" }) !== null);
      '`;

    const output = execSync(command, { encoding: 'utf-8' }).trim();

    return output.includes('true');
  } catch (error) {
    console.error('⚠️ Error checking user:', error.message);
    return false;
  }
}

function createLocalUser() {
  console.log('Creating local user...');
  try {
    execSync(
      `echo "y" | pnpm run create-user ${LOCAL_EMAIL} "${LOCAL_NAME}" "${LOCAL_USERNAME}" ${LOCAL_PASSWORD}`,
      { stdio: 'inherit' },
    );
    console.log(`User ${LOCAL_EMAIL} created successfully!`);
  } catch (error) {
    console.error('Failed to create user:', error.message);
  }
}

if (!isMongoRunning()) {
  startMongoDB();
}

if (userExists()) {
  console.log(`User ${LOCAL_EMAIL} already exists. Skipping creation.`);
  console.log('🔑 You can now log in with:', LOCAL_EMAIL, '/', LOCAL_PASSWORD);
} else {
  createLocalUser();
}
