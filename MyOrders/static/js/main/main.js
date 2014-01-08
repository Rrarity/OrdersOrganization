/**
 * User: gmn17_000
 * Date: 08.01.14
 * Time: 14:59
 */
(function($) {
    $(document).ready(function(e) {
        $("#exit").click(function(e) {
            e.preventDefault();
            return $.get("/my_orders/logout/", function() { //TODO: My_orders
                return location.href = "/";
            });
        })
    });
})(jQuery);