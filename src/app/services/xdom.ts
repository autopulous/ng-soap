import {Injectable} from '@angular/core';

export const namespaceSeparator: string = ':';

export const nodeTypeNames: string[] = [
  undefined,
  'Element',
  'Attribute',
  'Text',
  'CDATA Section',
  'Entity Reference',
  'Entity',
  'Processing Instruction',
  'Comment',
  'Document',
  'Document Type',
  'Document Fragment',
  'Notation'
];

export enum nodeTypes {
  UNDEFINED = 0,
  ELEMENT = 1,
  ATTRIBUTE = 2,
  TEXT = 3,
  CDATA_SECTION = 4,
  ENTITY_REFERENCE = 5,
  ENTITY = 6,
  PROCESSING_INSTRUCTION = 7,
  COMMENT = 8,
  DOCUMENT = 9,
  DOCUMENT_TYPE = 10,
  DOCUMENT_FRAGMENT = 11,
  NOTATION = 12
}

export const nodeTypeKeys: string[] = Object.keys(nodeTypes);

@Injectable()
export class XDom {
  public static isNodeType(nodeType: number): boolean {
    return nodeType ? !!nodeTypeKeys[nodeType] : false;
  }

  public static isNodeTypeKey(nodeTypeKey: any): boolean {
    return nodeTypeKey ? !!nodeTypes[nodeTypeKey] : false;
  }

  public static nodeType(nodeTypeKey: any): string {
    return nodeTypeKey ? nodeTypes[nodeTypeKey] : undefined;
  }

  public static nodeTypeKey(nodeType: number): string {
    return nodeType ? nodeTypeKeys[nodeType] : undefined;
  }

  public static nodeTypeName(nodeType: number): string {
    return nodeType ? nodeTypeNames[nodeType] : undefined;
  }
}
