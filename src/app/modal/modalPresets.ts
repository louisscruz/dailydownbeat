import {Modal} from 'angular2-modal/angular2-modal';

export function flagContent(modal: Modal, title: string, username: string) {
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-warning')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to flag <b>`
    + title +
    `</b> by <b>`
    + username +
    `</b>?`
  )
  .okBtn('Flag')
  .okBtnClass('btn btn-warning')
  .cancelBtnClass('btn btn-secondary');
}

export function deleteContent(modal: Modal, title: string, username: string) {
  return modal.confirm()
  .size('md')
  .isBlocking(false)
  .keyboard(27)
  .headerClass('modal-header bg-danger')
  .title('Are you sure?')
  .body(`
    <p>Are you sure that you would like to delete <b>`
    + title +
    `</b> by <b>`
    + username +
    `</b>?`
  )
  .okBtn('Delete')
  .okBtnClass('btn btn-danger')
  .cancelBtnClass('btn btn-secondary');
}

export function confirm(modal: Modal) {
  return modal.confirm()
  .size('lg')
  .titleHtml(`
    <div class="modal-title"
    style="font-size: 22px; color: grey; text-decoration: underline;">
    A simple Confirm style modal window</div>`)
  .body(`
    <h4>Confirm is a classic (title/body/footer) 2 button modal window that blocks.</h4>
    <b>Configuration:</b>
    <ul>
    <li>Blocks (only button click can close/dismiss)</li>
    <li>Size large</li>
    <li>Keyboard can not dismiss</li>
    <li>HTML Title</li>
    <li>HTML content</li>
    </ul>`
  );
}
