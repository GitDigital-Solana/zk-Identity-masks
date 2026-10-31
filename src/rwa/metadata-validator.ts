import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema, RWAMetadata } from './schema-loader';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateMetadata(data: unknown): { valid: boolean; errors: string[] } {
  const schema = loadSchema('rwa.schema.json');
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid: !!valid,
    errors: validate.errors?.map(e => `${e.instancePath} ${e.message}`) || [],
  };
}

export function parseRWAMetadata(raw: string): RWAMetadata {
  const parsed = JSON.parse(raw);
  const result = validateMetadata(parsed);
  if (!result.valid) {
    throw new Error(`Invalid RWA metadata: ${result.errors.join(', ')}`);
  }
  return parsed as RWAMetadata;
}