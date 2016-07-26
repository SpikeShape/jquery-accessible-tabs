requirejs.config({
	'appdir': '../',
	'baseUrl': './',
	'paths': {
		//{{app}}
    'tabs': 'app/tabs/tabs',

		//{{libs}}

		'jquery-accessible-tabs': '../../dist/javascript/jquery-accessible-tabs',
		'jquery.exists': 'libs/jquery.exists/jquery.exists',
		'jquery': 'libs/jquery/dist/jquery.min'
	},
	'shim': {
		'jquery.exists': ['jquery']
	}
});

requirejs(['app/main']);
