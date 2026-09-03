export const passwordRules = [
  { id: 'length', label: 'Mínimo de 8 caracteres', test: (pwd) => pwd.length >= 8 },
  { id: 'lowercase', label: 'Pelo menos uma letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'uppercase', label: 'Pelo menos uma letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'number', label: 'Pelo menos um número', test: (pwd) => /[0-9]/.test(pwd) },
  { id: 'special', label: 'Caractere especial permitido (@ $ ! % * ? &)', test: (pwd) => /[@$!%*?&]/.test(pwd) },
];

export const validatePassword = (password = '') => {
  const results = passwordRules.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(password),
  }));

  const isStrong = results.every((r) => r.met);
  const score = results.filter((r) => r.met).length;

  return { results, isStrong, score };
};