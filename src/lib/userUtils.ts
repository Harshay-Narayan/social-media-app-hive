export function validateUserName(
  firstName: string | undefined | null,
  lastName: string | undefined | null
) {
  if (!firstName && !lastName) return "Invalid User!";
  if (!firstName && lastName) return `${lastName}`;
  if (!lastName && firstName) return `${firstName}`;
  return `${firstName} ${lastName}`;
}
