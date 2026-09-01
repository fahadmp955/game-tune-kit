import { ChurnInputs, ChurnOutputs } from '../types';

export const calculateChurn = (inputs: ChurnInputs): ChurnOutputs => {
  const { d1RetentionPercent, d7RetentionPercent, d30RetentionPercent } = inputs;
  const d1Churn = 100 - d1RetentionPercent;
  const d7Churn = 100 - d7RetentionPercent;
  const d30Churn = 100 - d30RetentionPercent;

  return { d1Churn, d7Churn, d30Churn };
};
