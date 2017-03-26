import {Injectable} from '@angular/core';

import {nodeTypes} from './xdom';

const ATTRIBUTES: string = '_';
const TEXT: string = '$';

@Injectable()
export class XDom2Jso {
  public localName_: boolean = false;

  public constructor(localName?: boolean) {
    if (localName) {
      this.localName_ = localName;
    }
  }

  public set useLocalName(localName: boolean) {
    this.localName_ = localName;
  }

  public get useLocalName(): boolean {
    return this.localName_;
  }

  public convert(xmlRoot: Node): {} {
    const jsoRoot: {} = {};

    this.convertNodes(jsoRoot, xmlRoot);
    return jsoRoot;
  }

  public convertNodes(jso: any, node: Node): void {
    const nodeType: number = node.nodeType;
    const nodeName: string = this.localName_ ? node.localName : node.nodeName;

    if (nodeTypes.ELEMENT === nodeType) {
      const jsoNode: any = {};

      const attributeNodes: NamedNodeMap = node.attributes;
      const attributeIndex: number = attributeNodes.length;

      if (0 < attributeIndex) {
        const attributes: any = {};

        for (let attributeIndex: number = 0; attributeNodes.length > attributeIndex; ++attributeIndex) {
          const attribute: Attr = attributeNodes.item(attributeIndex);
          attributes[this.localName_ ? attribute.localName : attribute.nodeName] = attribute.value;
        }

        jsoNode[ATTRIBUTES] = attributes;
      }

      const childNodes: NodeList = node.childNodes;

      for (let childIndex: number = 0; childNodes.length > childIndex; ++childIndex) {
        this.convertNodes(jsoNode, childNodes[childIndex]);
      }

      if (!jso[nodeName]) {
        jso[nodeName] = jsoNode;
      }
      else {
        if (Array !== jso[nodeName].constructor) {
          const jsoFirstNode: {} = jso[nodeName];

          jso[nodeName] = [];
          jso[nodeName].push(jsoFirstNode);
        }

        jso[nodeName].push(jsoNode);
      }
    }
    else if (nodeTypes.TEXT === nodeType) {
      const nodeValue: string = node.nodeValue;

      if (/\S/.test(nodeValue)) {
        jso[TEXT] = nodeValue.trim();
      }
    }
  }
}
