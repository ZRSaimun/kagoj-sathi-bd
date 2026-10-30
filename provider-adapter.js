// No paid AI service is connected. This explicit contract fails closed.
// A future backend must authenticate, enforce rate/token/spend limits, keep keys
// server-side, review sources and require separate budget authorisation.
export const PROVIDER_MODE = 'disabled';
export class ProviderUnavailableError extends Error {
  constructor(){super('No approved server-side AI provider is configured. Use the reviewed FAQ.');this.name='ProviderUnavailableError';}
}
export async function requestModelAnswer(_request){
  throw new ProviderUnavailableError();
}
