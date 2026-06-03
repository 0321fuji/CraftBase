export function generateRandomId(length = 9) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let index = 0; index < length; index += 1) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
