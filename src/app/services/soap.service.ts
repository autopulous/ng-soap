import {Injectable} from '@angular/core';

import {XDom2Jso} from './xdom2jso';

@Injectable()
export class SoapService {
  private xdom2jso: XDom2Jso;
  private asynchronous: boolean = true;

  private servicePort: string = '';
  private servicePath: string = '';
  private serviceUrl: string = '';

  private targetNamespace: string = '';

  private envelopeBuilder_: (requestBody: string) => string = null;
  private xmlResponseHandler_: (response: NodeListOf<Element>) => void = null;
  private jsoResponseHandler_: (response: {}) => void = null;

  private static stripTagAttributes(tagNamePotentiallyWithAttributes: string): string {
    tagNamePotentiallyWithAttributes = tagNamePotentiallyWithAttributes + ' ';

    return tagNamePotentiallyWithAttributes.slice(0, tagNamePotentiallyWithAttributes.indexOf(' '));
  }

  public constructor(servicePort: string, servicePath: string, targetNamespace?: string, localName?: boolean) {
    this.xdom2jso = new XDom2Jso(localName);

    this.servicePort = servicePort;
    this.servicePath = servicePath;
    this.serviceUrl = servicePort + servicePath;

    if (!!targetNamespace) {
      this.targetNamespace = targetNamespace;
    }
  }

  public set envelopeBuilder(envelopeBuilder: (response: {}) => string) {
    this.envelopeBuilder_ = envelopeBuilder;
  }

  public set jsoResponseHandler(responseHandler: (response: {}) => void) {
    this.jsoResponseHandler_ = responseHandler;
  }

  public set xmlResponseHandler(responseHandler: (response: NodeListOf<Element>) => void) {
    this.xmlResponseHandler_ = responseHandler;
  }

  public set localNameMode(on: boolean) {
    this.xdom2jso.useLocalName = on;
  }

  public set testMode(on: boolean) {
    this.asynchronous = !on;
  }

  public post(method: string, parameters: any, responseRoot?: string): void {
    const request: string = this.toXml(parameters);
    const envelopedRequest: string = null != this.envelopeBuilder_ ? this.envelopeBuilder_(request) : request;

    const xmlHttp: XMLHttpRequest = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => {
      if (4 === xmlHttp.readyState) {
        const responseNodeList: NodeListOf<Element> = <NodeListOf<Element>>(!!responseRoot ? xmlHttp.responseXML.getElementsByTagNameNS('*', responseRoot) : xmlHttp.responseXML);

        if (!!this.xmlResponseHandler_) {
          this.xmlResponseHandler_(responseNodeList);
        }

        if (!!this.jsoResponseHandler_) {
          const response: {} = this.xdom2jso.convert(responseNodeList[0]);

          this.jsoResponseHandler_(response);
        }
      }
    };

    xmlHttp.open('POST', this.serviceUrl, this.asynchronous);

    xmlHttp.setRequestHeader('SOAPAction', this.targetNamespace + '/' + encodeURIComponent(method));
    xmlHttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

    xmlHttp.send(envelopedRequest);
  }

  private toXml(parameters: any): string {
    let xml: string = '';

    switch (typeof(parameters)) {
      case 'string':
        xml += parameters.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        break;

      case 'number':
      case 'boolean':
        xml += parameters.toString();
        break;

      case 'object':
        if (parameters.constructor.toString().indexOf('function Date()') > -1) {
          const year: string = parameters.getFullYear().toString();
          const month: string = ('0' + (parameters.getMonth() + 1).toString()).slice(-2);
          const date: string = ('0' + parameters.getDate().toString()).slice(-2);
          const hours: string = ('0' + parameters.getHours().toString()).slice(-2);
          const minutes: string = ('0' + parameters.getMinutes().toString()).slice(-2);
          const seconds: string = ('0' + parameters.getSeconds().toString()).slice(-2);
          const milliseconds: string = parameters.getMilliseconds().toString();

          let tzOffsetMinutes: number = Math.abs(parameters.getTimezoneOffset());
          let tzOffsetHours: number = 0;

          while (tzOffsetMinutes >= 60) {
            tzOffsetHours++;
            tzOffsetMinutes -= 60;
          }

          const tzMinutes: string = ('0' + tzOffsetMinutes.toString()).slice(-2);
          const tzHours: string = ('0' + tzOffsetHours.toString()).slice(-2);

          const timezone: string = ((parameters.getTimezoneOffset() < 0) ? '-' : '+') + tzHours + ':' + tzMinutes;

          xml += year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + timezone;
        }
        else if (parameters.constructor.toString().indexOf('function Array()') > -1) { // Array
          for (const parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
              if (Array.isArray(parameters)) { // linear array
                (/function\s+(\w*)\s*\(/ig).exec(parameters[parameter].constructor.toString());

                let type = RegExp.$1;

                switch (type) {
                  case '':
                    type = typeof(parameters[parameter]);
                    break;
                  case 'String':
                    type = 'string';
                    break;
                  case 'Number':
                    type = 'int';
                    break;
                  case 'Boolean':
                    type = 'bool';
                    break;
                  case 'Date':
                    type = 'DateTime';
                    break;
                }
                xml += this.toElement(type, parameters[parameter]);
              }
              else { // associative array
                xml += this.toElement(parameter, parameters[parameter]);
              }
            }
          }
        }
        else { // Object or custom function
          for (const parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
              xml += this.toElement(parameter, parameters[parameter]);
            }
          }
        }
        break;

      default:
        throw new Error('SoapService error: type "/' + typeof(parameters) + '"/ is not supported');
    }

    return xml;
  }

  private toElement(tagNamePotentiallyWithAttributes: string, parameters: any): string {
    const elementContent: string = this.toXml(parameters);

    if ('' === elementContent) {
      return '<' + tagNamePotentiallyWithAttributes + '/>';
    }
    else {
      return '<' + tagNamePotentiallyWithAttributes + '>' + elementContent + '</' + SoapService.stripTagAttributes(tagNamePotentiallyWithAttributes) + '>';
    }
  }
}
