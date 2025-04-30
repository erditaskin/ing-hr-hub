export type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

export type Schema = {
  [key: string]: ValidationRule[];
};

export class Validator {
  private rules: ValidationRule[] = [];

  getRules(): ValidationRule[] {
    return this.rules;
  }

  required(message: string = 'This field is required'): this {
    this.rules.push({
      test: (value: any) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      },
      message,
    });
    return this;
  }

  email(message: string = 'Invalid email address'): this {
    this.rules.push({
      test: (value: any) => {
        if (!value) return true; // Skip if empty (use required() for required fields)
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value);
      },
      message,
    });
    return this;
  }

  min(length: number, message: string = `Minimum length is ${length}`): this {
    this.rules.push({
      test: (value: any) => {
        if (!value) return true;
        if (typeof value === 'string') return value.length >= length;
        if (typeof value === 'number') return value >= length;
        if (Array.isArray(value)) return value.length >= length;
        return true;
      },
      message,
    });
    return this;
  }

  max(length: number, message: string = `Maximum length is ${length}`): this {
    this.rules.push({
      test: (value: any) => {
        if (!value) return true;
        if (typeof value === 'string') return value.length <= length;
        if (typeof value === 'number') return value <= length;
        if (Array.isArray(value)) return value.length <= length;
        return true;
      },
      message,
    });
    return this;
  }

  matches(pattern: RegExp, message: string = 'Invalid format'): this {
    this.rules.push({
      test: (value: any) => {
        if (!value) return true;
        return pattern.test(value);
      },
      message,
    });
    return this;
  }

  oneOf(values: any[], message: string = 'Invalid value'): this {
    this.rules.push({
      test: (value: any) => {
        if (!value) return true;
        return values.includes(value);
      },
      message,
    });
    return this;
  }

  custom(testFn: (value: any) => boolean, message: string): this {
    this.rules.push({
      test: testFn,
      message,
    });
    return this;
  }

  validate(value: any): string | null {
    for (const rule of this.rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }
    return null;
  }
}

export function createSchema(schema: { [key: string]: Validator }): Schema {
  const result: Schema = {};
  for (const [key, validator] of Object.entries(schema)) {
    result[key] = validator.getRules();
  }
  return result;
}

export function validateValues(values: any, schema: Schema): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = values[field];
    for (const rule of rules) {
      if (!rule.test(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  }

  return errors;
}
