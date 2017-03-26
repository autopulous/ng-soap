import {XDom, nodeTypes, nodeTypeNames, nodeTypeKeys, namespaceSeparator} from './xdom';
describe('autopulous-xdom unit test suite', () => {
  beforeAll(() => {
  });

  it('should validate the namespace delimiter character', () => {
    expect(':').toEqual(namespaceSeparator);
  });

  it('should have properly sized constant arrays', () => {
    expect(nodeTypeKeys.length).toEqual(26);
    expect(nodeTypeNames.length).toEqual(13);
  });

  it('should have monotonically ascending numeric member values', () => {
    expect(nodeTypes.UNDEFINED).toEqual(0);

    for (let index: number = nodeTypes.ELEMENT; nodeTypes.NOTATION >= index; index++) {
      expect(+nodeTypeKeys[index]).toEqual(index);
    }
  });

  it('should have monotonically ascending member values addressed by key names', () => {
    expect(nodeTypes[<any>nodeTypeKeys[nodeTypes.NOTATION + 1]]).toEqual(0);

    for (let index: number = nodeTypes.ELEMENT; nodeTypes.NOTATION >= index; index++) {
      expect(nodeTypes[<any>nodeTypeKeys[index + nodeTypes.NOTATION + 1]]).toEqual(index);
    }
  });

  it('should pass numeric nodeKey verification', () => {
    expect(false).toEqual(XDom.isNodeTypeKey('13'));

    for (let index: number = nodeTypes.ELEMENT; nodeTypes.NOTATION >= index; index++) {
      expect(true).toEqual(XDom.isNodeTypeKey(nodeTypeKeys[index]));
    }
  });

  it('should pass bogus string nodeKey verification', () => {
    expect(false).toEqual(XDom.isNodeTypeKey('BOGUS'));
  });

  it('should pass string nodeKey \'UNDEFINED\' verification', () => {
    expect(false).toEqual(XDom.isNodeTypeKey(nodeTypeKeys[nodeTypes.ELEMENT + nodeTypes.NOTATION]));
  });

  it('should pass looping string nodeKey verification', () => {
    for (let index: number = nodeTypes.ELEMENT + 1; nodeTypes.NOTATION >= index; index++) {
      expect(true).toEqual(XDom.isNodeTypeKey(nodeTypeKeys[index + nodeTypes.NOTATION]));
    }
  });

  it('should be able to retrieve nodeTypeKey by index', () => {
    for (let index: number = nodeTypes.ELEMENT; nodeTypes.NOTATION >= index; index++) {
      expect(index.toString(10)).toEqual(XDom.nodeTypeKey(index));
    }
  });

  it('should be able to retrieve a nodeType using a nodeType (reflexive)', () => {
    for (let index: number = nodeTypes.ELEMENT; nodeTypes.NOTATION >= index; index++) {
      expect(nodeTypeKeys[index + nodeTypes.NOTATION + 1]).toEqual(XDom.nodeType(XDom.nodeTypeKey(index)));
    }
  });

  it('should be able to retrieve a the text description of a nodeType', () => {
    expect(undefined).toEqual(XDom.nodeTypeName(nodeTypes.UNDEFINED));
    expect('Element').toEqual(XDom.nodeTypeName(nodeTypes.ELEMENT));
    expect('Notation').toEqual(XDom.nodeTypeName(nodeTypes.NOTATION));
    expect(undefined).toEqual(XDom.nodeTypeName(nodeTypes.NOTATION + 1));
  });
});
