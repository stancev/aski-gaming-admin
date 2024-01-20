import type { Schema, Attribute } from '@strapi/strapi';

export interface StringsStrings extends Schema.Component {
  collectionName: 'components_strings_strings';
  info: {
    displayName: 'Strings';
  };
  attributes: {
    name: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'strings.strings': StringsStrings;
    }
  }
}
