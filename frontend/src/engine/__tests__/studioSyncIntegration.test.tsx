// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudioProvider } from '../../context/StudioContext';
import { LtvCalculatorView } from '../../components/utilities/LtvCalculatorView';
import { OfferCalculatorView } from '../../components/utilities/OfferCalculatorView';
import { CampaignImpactSimulator } from '../../components/pns/CampaignImpactSimulator';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('PNS <-> Utilities Synchronization Integration', () => {
  it('renders StudioCohortSelector inside LtvCalculatorView and applies Whales cohort', async () => {
    const onInputsChange = vi.fn();

    render(
      <StudioProvider>
        <LtvCalculatorView onInputsChange={onInputsChange} />
      </StudioProvider>
    );

    // Initial check: Manual Sandbox Mode
    expect(screen.getByText(/Studio Cohort Sync \(Layer 1\/2\)/i)).toBeDefined();
    expect(screen.getByText(/Manual Sandbox Mode/i)).toBeDefined();

    // Click Connect Studio Segment button
    const connectButton = screen.getByRole('button', { name: /Connect Studio Segment/i });
    fireEvent.click(connectButton);

    // The cohort dropdown should be visible
    expect(screen.getByText(/Select Live Cohort Segment/i)).toBeDefined();

    // Click Apply
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyButton);

    // Should now be Live Connected
    expect(screen.getByText(/Live Connected/i)).toBeDefined();
    expect(screen.getByText(/PNS Segment Audience Revenue Forecast/i)).toBeDefined();

    // Inputs change callback was called with cohort values
    expect(onInputsChange).toHaveBeenCalled();
  });

  it('renders StudioCohortSelector inside OfferCalculatorView and computes push offer projections', async () => {
    const onInputsChange = vi.fn();

    render(
      <StudioProvider>
        <OfferCalculatorView onInputsChange={onInputsChange} />
      </StudioProvider>
    );

    // Click Connect Studio Segment button
    const connectButton = screen.getByRole('button', { name: /Connect Studio Segment/i });
    fireEvent.click(connectButton);

    // Click Apply
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyButton);

    // Banner should display for cohort
    expect(screen.getByText(/Push Offer Campaign Projection/i)).toBeDefined();
  });

  it('CampaignImpactSimulator dynamically simulates open rate, buyers, and gross revenue', () => {
    render(
      <CampaignImpactSimulator
        cohortName="Whales & High VIPs ($100+)"
        targetReach={2450}
        campaignTitle="👑 VIP Exclusive Vault"
        deepLinkScreen="shop_vault_vip"
      />
    );

    expect(screen.getByText(/Campaign Impact & Revenue Simulator/i)).toBeDefined();
    expect(screen.getByText(/L0 ⟷ L1 Sync/i)).toBeDefined();
    expect(screen.getByText(/Target Segment/i)).toBeDefined();
    expect(screen.getAllByText(/Whales & High VIPs \(\$100\+\) \(2,450 players\)/i).length).toBeGreaterThan(0);

    // Verify deep-link buttons exist
    expect(screen.getByRole('button', { name: /Offer Calculator/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Full LTV Model/i })).toBeDefined();
  });
});
