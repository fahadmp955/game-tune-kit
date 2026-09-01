import { CurrencyExchangeInputs, CurrencyExchangeOutputs } from '../types';

export const calculateCurrencyExchange = (inputs: CurrencyExchangeInputs): CurrencyExchangeOutputs => {
  const { realMoneyUsd, usdToHardRatio, hardToSoftRatio } = inputs;

  const hardCurrencyEquivalent = Math.round(realMoneyUsd * usdToHardRatio);
  const softCurrencyEquivalent = Math.round(hardCurrencyEquivalent * hardToSoftRatio);
  const softPerUsd = Math.round(usdToHardRatio * hardToSoftRatio);

  return {
    hardCurrencyEquivalent,
    softCurrencyEquivalent,
    softPerUsd,
  };
};
