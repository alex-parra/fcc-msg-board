import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

const hashPass = async password => {
  const hashedPass = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  return hashedPass;
};

const comparePass = async (testPass, validPass) => {
  return await bcrypt.compare(testPass, validPass);
}


export {
  hashPass,
  comparePass,
}