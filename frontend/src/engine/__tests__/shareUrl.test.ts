import { describe, it, expect } from 'vitest';
import { encodeStateToUrl } from '../../utils/stateSerializer';

describe('Share Link URL Serialization & Parsing', () => {
  it('encodes inputs into URL with util and state parameters', () => {
    const utilityId = '01-ltv-calculator';
    const inputs = { d1Retention: 45, d7Retention: 22, dailyArpu: 0.5 };

    const generatedUrl = encodeStateToUrl(utilityId, inputs);
    expect(generatedUrl).toContain('util=01-ltv-calculator');
    expect(generatedUrl).toContain('state=');
  });
});
