export const PASSWORD = "Passw0rd1";

export const newUser = () => ({
  email: `qa.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
  password: PASSWORD,
});
