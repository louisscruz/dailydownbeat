import {Component, OnInit, ElementRef, Renderer, Self, Input} from 'angular2/core';
//import {NgModel, NgClass} from 'angular2/common';

const modalConfig = {
  //itemsPerPage: 10,
  //previousText: '« Previous',
  //nextText: 'Next »',
  //align: true
};

const MODAL_TEMPLATE = `
<div class="modal fade">
<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Modal title</h4>
    </div>
    <div class="modal-body">
      <p>One fine body&hellip;</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </div><!-- /.modal-content -->
</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
`;

@Component({
  selector: 'modal',
  template: MODAL_TEMPLATE,
  directives: [],
  inputs: []
})
export class Modal implements OnInit {
  public config = modalConfig;

  constructor(@Self() renderer: Renderer, elementRef: ElementRef) {
    //super(cd, renderer, elementRef);
  }

  ngOnInit() {

  }
}
