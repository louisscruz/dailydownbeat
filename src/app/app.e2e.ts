describe('App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result = 'Freedom Mortgage';
    expect(subject).toEqual(result);
  });
});
