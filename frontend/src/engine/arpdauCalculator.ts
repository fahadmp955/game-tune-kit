import { ArpdauInputs, ArpdauOutputs } from '../types';

export const calculateArpdau = (inputs: ArpdauInputs): ArpdauOutputs => {
  const { dau, dailyRevenue, payingUsers } = inputs;

  const validDau = Math.max(1, dau);
  const arpdau = dailyRevenue / validDau;

  const validPayers = Math.max(0, payingUsers);
  const arppu = validPayers > 0 ? dailyRevenue / validPayers : 0;
  const payerConversionRate = (validPayers / validDau) * 100;

  return {
    arpdau: Number(arpdau.toFixed(3)),
    arppu: Number(arppu.toFixed(2)),
    payerConversionRate: Number(payerConversionRate.toFixed(2)),
    monetisationHealth: payerConversionRate >= 3.0 ? 'High Performing' : payerConversionRate >= 1.5 ? 'Healthy' : 'Low Conversion',
  };
};
