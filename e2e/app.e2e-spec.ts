import { NgSoapPage } from './app.po';

describe('ng-soap App', () => {
  let page: NgSoapPage;

  beforeEach(() => {
    page = new NgSoapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
