var modal = ( function ( Modal, global ) {
  if ( typeof global !== 'undefined' ) {
    return function ( config ) {
      return new Modal( config );
    };
  }
} )( function ( config ) {
  var modal = null;
  var modalHeader = 'My title';
  var modalBody = config;
  var backgroundScroll = false;
  if ( typeof config === 'object' ) {
    modalBody = config.text;
    modalHeader = config.title;
    if(config.hasOwnProperty('backgroundScroll')){
      backgroundScroll = config.backgroundScroll;
    }
  }

  function createModal() {
    var id = Math.random().toString( 36 ).substring( 7 );
    document
     .body
     .insertAdjacentHTML(
      'afterbegin',
      '' +
      '<div id="' + id + '" class="modal">' +
      '  <div class="modal-header">' +
      '   <span></span><b class="close">&#10006;</b>' +
      '  </div>' +
      '  <div class="modal-body"></div>' +
      '  <div class="modal-footer">' +
      '    <button class="close btn btn-primary">Cancel</button>' +
      '    <button class="confirm btn btn-success">Confirm</button>' +
      '  </div>' +
      '</div>' );

    if ( !'.modal-cover'.find() ) {
      var modalCover = document.createElement( 'div' );
      modalCover.setAttribute( 'class', 'modal-cover hidden' );
      document.body.appendChild( modalCover );
    }

    return document.getElementById( id );
  }

  var callbacks = {
    hide: [],
    confirm: [],
    show: [],
  };

  this.on = {
    confirm: function ( callback ) {
      callbacks[ 'confirm' ].push( callback );
      return this;
    }.bind( this ),
    hide: function ( callback ) {
      callbacks[ 'hide' ].push( callback );
      return this;
    }.bind( this ),
    show: function ( callback ) {
      callbacks[ 'show' ].push( callback );
      return this;
    }.bind( this ),
  };


  this.show = function ( instantCallback ) {
    this.hide();
    modal = createModal();
    // set header/body text
    modal
     .find( 'div.modal-header>span' )
     .innerText = modalHeader;
    if ( config.allowHTML ) {
      modal
       .find( 'div.modal-body' )
       .innerHTML = modalBody;
    } else {
      modal
       .find( 'div.modal-body' )
       .innerText = modalBody;
    }
    // bind event listeners
    modal
     .find( 'button.close' )
     .addEventListener( 'click', this.cancel.bind( this ) );
    modal
     .find( 'b.close' )
     .addEventListener( 'click', this.cancel.bind( this ) );
    modal
     .find( 'button.confirm' )
     .addEventListener( 'click', this.confirm.bind( this ) );

    if ( typeof instantCallback === 'function' ) instantCallback.call( modal );
    if ( callbacks.hasOwnProperty( 'show' ) ) {
      callbacks.show.forEach( function ( fn ) {
        if ( typeof fn === 'function' ) fn.call( modal );
      } );
    }

    'div.modal-cover'.find().show();
    backgroundScroll || 'body'.find().overflowHidden();
    return this;
  };

  this.hide = function () {
    if ( modal ) {
      modal
       .find( 'button.close' )
       .removeEventListener( 'click', this.hide );
      modal
       .find( 'button.confirm' )
       .removeEventListener( 'click', this.confirm );
      modal.parentNode.removeChild( modal );
      // exec callbacks
      if ( callbacks.hasOwnProperty( 'hide' ) ) {
        callbacks.hide.forEach( function ( fn ) {
          if ( typeof fn === 'function' ) fn();
        } );
      }
      'div.modal-cover'.find().hide();
    }
    // enable scrolling back to normal modal is hidden
    backgroundScroll || 'body'.find().overflowAuto();

    return this;
  };

  this.confirm = function () {
    modal
     .find( 'button.close' )
     .removeEventListener( 'click', this.hide );
    modal
     .find( 'button.confirm' )
     .removeEventListener( 'click', this.confirm );
    modal.parentNode.removeChild( modal );

    if ( callbacks.hasOwnProperty( 'confirm' ) ) {
      callbacks.confirm.forEach( function ( fn ) {
        if ( typeof fn === 'function' ) fn();
      } );
    }
    'div.modal-cover'.find().hide();
  };

  this.cancel = function () {
    this.hide();
  };

}, window );


