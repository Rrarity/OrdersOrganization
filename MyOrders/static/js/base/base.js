/**
 * User: gmn17_000
 * Date: 08.01.14
 * Time: 16:05
 */

var N_ALERT = 'alert';
var N_INFORMATION = 'information';
var N_ERROR = 'error';
var N_WARNING = 'warning';
var N_NOTIFICATION = 'notification';
var N_SUCCESS = 'success';

function show_error(text, type, timeout) {
    type = typeof type !== 'undefined' ? type : N_ERROR;
    timeout = typeof timeout !== 'undefined' ? timeout : 3000;
  	noty({
  		text: text,
  		type: type,
        timeout: timeout,
        dismissQueue: false,
        layout: 'topCenter',
  		theme: 'defaultTheme'
  	});
}
