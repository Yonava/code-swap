export function generateCode(length: number) {
  return (Math.random() + 1).toString(36).substring(2, length + 2);
}
