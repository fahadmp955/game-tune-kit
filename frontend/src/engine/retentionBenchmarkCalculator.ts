import { RetentionBenchmarkInputs, RetentionBenchmarkOutputs } from '../types';

export const calculateRetentionBenchmark = (inputs: RetentionBenchmarkInputs): RetentionBenchmarkOutputs => {
  const { observedD1, observedD7, genreD1Benchmark, genreD7Benchmark } = inputs;
  const d1Gap = Number((observedD1 - genreD1Benchmark).toFixed(1));
  const d7Gap = Number((observedD7 - genreD7Benchmark).toFixed(1));
  const performanceTier = d1Gap >= 0 && d7Gap >= 0 ? 'Top Quartile (> P75)' : d1Gap >= -5 ? 'Median Range (P50)' : 'Below Genre Average (< P25)';

  return { d1Gap, d7Gap, performanceTier };
};
