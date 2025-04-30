export interface ILocale {
  language: string;
  supportedLanguages: string[];
}

import en from '../../translations/en.json';

export type TranslationKeys = typeof en;
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationKeys>;
export type SupportedLanguages = 'en' | 'tr';
