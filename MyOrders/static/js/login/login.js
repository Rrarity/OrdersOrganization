/**
 * User: gmn17_000
 * Date: 07.01.14
 * Time: 23:04
 */
(function($) {
    $(document).ready(function(e) {
        $("input[name='password'],input[name='login']").keypress(function(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                if (e.currentTarget.name == "login" ) {
                    $(".login_form input[name=password]").select();
                } else {
                    $(".login_form").submit();
                }
            }
        });

        $( ".login_form" ).submit(function(e) {
            var password = $("input[name='password']").val(),
                login = $("input[name='login']").val();
            if ((password.length == 0) || (login.length == 0)) return false;
            $.post("/my_orders/login/", { //TODO: Убрать позже
                    username: login,
                    password: password
                }, function(data) {
                    if (data.error_codes.length > 0) {
                        console.log(data.error_codes);
                    } else {
                        location.href = '/my_orders/'; //TODO: Убрать позже
                        location.reload();
                    }
                });
              event.preventDefault();
        });
    });
})(jQuery);