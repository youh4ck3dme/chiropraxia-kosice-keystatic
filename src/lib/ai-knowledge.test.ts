import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, SYSTEM_PROMPT, type ServiceInfo } from './ai-knowledge';

describe('buildSystemPrompt', () => {
  it('includes service name and price in the prompt', () => {
    const services: ServiceInfo[] = [
      { name: 'Testovacia masáž', duration_min: 30, price: 40 },
    ];
    const prompt = buildSystemPrompt(services);
    expect(prompt).toContain('Testovacia masáž');
    expect(prompt).toContain('40€');
    expect(prompt).toContain('30 min');
  });

  it('formats full service line correctly: "- Názov (X min, Y€)"', () => {
    const services: ServiceInfo[] = [
      { name: 'Chiro masáž', duration_min: 50, price: 55 },
    ];
    const prompt = buildSystemPrompt(services);
    expect(prompt).toContain('- Chiro masáž (50 min, 55€)');
  });

  it('omits the duration prefix for services with duration_min 0', () => {
    const services: ServiceInfo[] = [
      { name: 'Expresný termín', duration_min: 0, price: 15 },
    ];
    const prompt = buildSystemPrompt(services);
    expect(prompt).toContain('- Expresný termín (15€)');
    expect(prompt).not.toContain('0 min');
  });

  it('lists all provided services in the prompt', () => {
    const services: ServiceInfo[] = [
      { name: 'Masáž A', duration_min: 50, price: 55 },
      { name: 'Masáž B', duration_min: 15, price: 30 },
    ];
    const prompt = buildSystemPrompt(services);
    expect(prompt).toContain('Masáž A');
    expect(prompt).toContain('Masáž B');
    expect(prompt).toContain('55€');
    expect(prompt).toContain('30€');
  });

  it('always contains the SLUŽBY A CENNÍK section header', () => {
    expect(buildSystemPrompt([])).toContain('SLUŽBY A CENNÍK:');
  });

  it('handles multiple services without mixing up prices', () => {
    const services: ServiceInfo[] = [
      { name: 'Prvá', duration_min: 10, price: 11 },
      { name: 'Druhá', duration_min: 20, price: 22 },
      { name: 'Tretia', duration_min: 0, price: 33 },
    ];
    const prompt = buildSystemPrompt(services);
    expect(prompt).toContain('- Prvá (10 min, 11€)');
    expect(prompt).toContain('- Druhá (20 min, 22€)');
    expect(prompt).toContain('- Tretia (33€)');
  });
});

describe('SYSTEM_PROMPT (fallback static values)', () => {
  it('contains the updated Chiropraktická masáž price 55€', () => {
    expect(SYSTEM_PROMPT).toContain('55€');
  });

  it('contains the updated Naprávanie/Chiropraxia price 30€', () => {
    expect(SYSTEM_PROMPT).toContain('30€');
  });

  it('contains the updated Celotelová chiro masáž price 75€', () => {
    expect(SYSTEM_PROMPT).toContain('75€');
  });

  it('contains the updated Expresný termín price 15€', () => {
    expect(SYSTEM_PROMPT).toContain('15€');
  });

  it('uses the new service name Naprávanie/Chiropraxia', () => {
    expect(SYSTEM_PROMPT).toContain('Naprávanie/Chiropraxia');
  });

  it('lists Naprávanie/Chiropraxia correctly formatted in the service list', () => {
    expect(SYSTEM_PROMPT).toContain('- Naprávanie/Chiropraxia (');
  });

  it('does not list old service name Korekcia as a service entry', () => {
    // "- Korekcia (" would indicate the old service line is still present
    expect(SYSTEM_PROMPT).not.toContain('- Korekcia (');
  });

  it('does not contain any old prices (49€, 25€, 65€, 10€)', () => {
    expect(SYSTEM_PROMPT).not.toContain('49€');
    expect(SYSTEM_PROMPT).not.toContain('25€');
    expect(SYSTEM_PROMPT).not.toContain('65€');
    expect(SYSTEM_PROMPT).not.toContain('10€');
  });
});
