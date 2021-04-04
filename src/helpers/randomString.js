/**
 * helper method to generate random string
 * @param {Number} n
 */
export default function randomString(n) {
  // character set
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  chars += chars.toUpperCase();
  chars += '1234567890';

  return Array(n)
    .fill(0)
    .map(() => chars[~~(Math.random() * chars.length)])
    .join('');
}
