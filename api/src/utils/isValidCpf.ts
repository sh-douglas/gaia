export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  const calculateDigit = (cpfSlice: string): number => {
    let sum = 0;
    const initialMultiplier = cpfSlice.length + 1;

    for (let i = 0; i < cpfSlice.length; i++) {
      sum += parseInt(cpfSlice[i]!) * (initialMultiplier - i);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 || remainder === 11 ? 0 : remainder;
  };

  const isFirstDigitValid =
    calculateDigit(cleanCPF.slice(0, 9)) === parseInt(cleanCPF[9]!);
  const isSecondDigitValid =
    calculateDigit(cleanCPF.slice(0, 10)) === parseInt(cleanCPF[10]!);

  return isFirstDigitValid && isSecondDigitValid;
}
