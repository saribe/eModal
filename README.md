# eModal for Bootstrap
**eModal** is a Easy way to manage modal dialogs using bootstrap.


## Current Version
1.1.0

## Quick Start

1. Link to eModal.js `<script src="//rawgit.com/saribe/eModal/master/dist/eModal.min.js"></script>`
2. use eModal to display a modal for alert, ajax, prompt or confirm

		// Display an alert modal with default title (Attention)
		eModal.alert('You shall not pass!');

### Other Options
	// Display a confirm modal, with custom title.
	eModal.confirm('Do you really want to pass?', 'Gandalf question', function(answer){...});
	
	// Display a ajax modal, with a title
	eModal.ajax('http://mydomail.com/page.html', 'Jobs - Form apply', function(DOMElement){...})
	
	// Display an prompt modal, with a title
	eModal.prompt('What is the best song ever?', 'Fill the input')
	
	// Display an modal whith iframe inside, with a title
	eModal.iframe('http://saribe.github.io/toastr8/', 'Hot news')
			
	// eModal default settings with your custom html loading template
	eModal.setEModalOptions({ 
        loadingHtml: '<span class="fa fa-circle-o-notch fa-spin fa-3x text-primary"></span><h4>Loading</h4>',
        ...
    });

## Demo and documentation
- Demo can be found at http://saribe.github.io/eModal

## Copyright
Copyright © 2014-2015 

## License
Under MIT license - http://www.opensource.org/licenses/mit-license.php
